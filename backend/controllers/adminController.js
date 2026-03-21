const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Academic Years
const getAcademicYears = async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM academic_years');
    res.json(rows);
};

const createAcademicYear = async (req, res) => {
    const { year_range } = req.body;
    await pool.execute('INSERT INTO academic_years (year_range) VALUES (?)', [year_range]);
    res.status(201).json({ message: 'Academic Year created' });
};

// Departments
const getDepartments = async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM departments');
    res.json(rows);
};

const createDepartment = async (req, res) => {
    const { name } = req.body;
    await pool.execute('INSERT INTO departments (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Department created' });
};

// Duties
const getDuties = async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM duties');
    res.json(rows);
};

const createDuty = async (req, res) => {
    const { name } = req.body;
    try {
        // Insert the new duty
        const [result] = await pool.execute('INSERT INTO duties (name) VALUES (?)', [name]);
        const dutyId = result.insertId;

        // Auto-create clearance rows for ALL existing students for this new duty
        const [students] = await pool.execute('SELECT id FROM students');
        if (students.length > 0) {
            const values = students.map(s => [s.id, dutyId]).map(pair => `(${pair[0]}, ${pair[1]}, 'cleared')`).join(', ');
            await pool.execute(
                `INSERT IGNORE INTO student_clearance_status (student_id, duty_id, status) VALUES ${values}`
            );
        }

        res.status(201).json({ message: 'Duty created and assigned to all students' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteDuty = async (req, res) => {
    const { id } = req.params;
    await pool.execute('DELETE FROM duties WHERE id = ?', [id]);
    res.json({ message: 'Duty deleted successfully' });
};

const updateDuty = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    await pool.execute('UPDATE duties SET name = ? WHERE id = ?', [name, id]);
    res.json({ message: 'Duty updated successfully' });
};

// Users (Tutor/Teacher/Both)
const createUser = async (req, res) => {
    const { username, email, password, role, duty_ids, department_id, academic_year_id } = req.body;
    
    const conn = await pool.getConnection();
    
    try {
        await conn.beginTransaction();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [userResult] = await conn.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );
        const userId = userResult.insertId;

        // Duty assignments are now handled separately via assignDutyToTeacher
        // to ensure uniqueness and simplify the workflow.

        if ((role === 'tutor' || role === 'both') && department_id && academic_year_id) {
            await conn.execute(
                'INSERT INTO tutor_assignments (user_id, department_id, academic_year_id) VALUES (?, ?, ?)',
                [userId, department_id, academic_year_id]
            );
        }

        await conn.commit();
        res.status(201).json({ message: 'User created and assigned successfully' });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ message: 'Failed to create user: ' + err.message });
    } finally {
        conn.release();
    }
};

const unassignDuty = async (req, res) => {
    const { user_id, duty_id } = req.body;
    try {
        await pool.execute(
            'DELETE FROM teacher_duty_assignments WHERE user_id = ? AND duty_id = ?',
            [user_id, duty_id]
        );
        res.json({ message: 'Duty unassigned successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Assignments
const assignDutyToTeacher = async (req, res) => {
    const { user_id, duty_id } = req.body;
    try {
        // Check if this specific duty is already assigned to ANYONE
        const [existing] = await pool.execute(
            'SELECT u.username FROM teacher_duty_assignments tda JOIN users u ON tda.user_id = u.id WHERE tda.duty_id = ?',
            [duty_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ 
                message: `The duty is already assigned to ${existing[0].username}` 
            });
        }

        await pool.execute(
            'INSERT INTO teacher_duty_assignments (user_id, duty_id) VALUES (?, ?)',
            [user_id, duty_id]
        );
        res.status(201).json({ message: 'Duty assigned to teacher' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const assignTutor = async (req, res) => {
    const { user_id, department_id, academic_year_id } = req.body;
    try {
        // Check if this batch already has a tutor
        const [existing] = await pool.execute(
            `SELECT u.username FROM tutor_assignments ta 
             JOIN users u ON ta.user_id = u.id 
             WHERE ta.department_id = ? AND ta.academic_year_id = ?`,
            [department_id, academic_year_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ 
                message: `This batch is already assigned to tutor: ${existing[0].username}` 
            });
        }

        // Reassigning: remove existing assignment for this user if any (since one tutor = one batch in this simplified model)
        await pool.execute('DELETE FROM tutor_assignments WHERE user_id = ?', [user_id]);

        await pool.execute(
            'INSERT INTO tutor_assignments (user_id, department_id, academic_year_id) VALUES (?, ?, ?)',
            [user_id, department_id, academic_year_id]
        );
        res.status(201).json({ message: 'Tutor assigned successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getDashboardStats = async (req, res) => {
    const [[{ studentCount }]] = await pool.execute('SELECT COUNT(*) as studentCount FROM students');
    const [[{ teacherCount }]] = await pool.execute('SELECT COUNT(*) as teacherCount FROM users WHERE role = "teacher" OR role = "both"');
    const [[{ tutorCount }]] = await pool.execute('SELECT COUNT(*) as tutorCount FROM users WHERE role = "tutor" OR role = "both"');
    const [[{ departmentCount }]] = await pool.execute('SELECT COUNT(*) as departmentCount FROM departments');

    res.json({
        students: studentCount,
        teachers: teacherCount,
        tutors: tutorCount,
        departments: departmentCount
    });
};

const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT id, username, email, role FROM users 
            WHERE role IN ('teacher', 'tutor', 'both')
            ORDER BY username ASC
        `);

        // Fetch current assignments for each user to show in UI
        const usersWithDetails = await Promise.all(rows.map(async (u) => {
            if (u.role === 'teacher' || u.role === 'both') {
                const [duties] = await pool.execute(`
                    SELECT d.id, d.name 
                    FROM teacher_duty_assignments tda
                    JOIN duties d ON tda.duty_id = d.id
                    WHERE tda.user_id = ?
                `, [u.id]);
                u.assigned_duties = duties;
            }
            if (u.role === 'tutor' || u.role === 'both') {
                const [tutorRows] = await pool.execute(`
                    SELECT d.name as department_name, ay.year_range 
                    FROM tutor_assignments ta
                    JOIN departments d ON ta.department_id = d.id
                    JOIN academic_years ay ON ta.academic_year_id = ay.id
                    WHERE ta.user_id = ?
                    LIMIT 1
                `, [u.id]);
                u.tutor_assignment = tutorRows[0] || null;
            }
            return u;
        }));

        res.json(usersWithDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to delete user with ID: ${id}`);
    try {
        await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('DELETE USER ERROR:', err);
        res.status(500).json({ message: 'Database error: ' + err.message });
    }
};

const updateUserAdmin = async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    try {
        await pool.execute(
            'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
            [username, email, role, id]
        );
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getYearDrops = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT yd.*, s.register_number, u.username, d.name as department_name, ay.year_range
            FROM year_drops yd
            JOIN students s ON yd.student_id = s.id
            JOIN users u ON s.user_id = u.id
            JOIN departments d ON s.department_id = d.id
            JOIN academic_years ay ON s.academic_year_id = ay.id
            ORDER BY yd.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateYearDropStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await pool.execute('UPDATE year_drops SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Year drop request ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAcademicYears, createAcademicYear,
    getDepartments, createDepartment,
    getDuties, createDuty, deleteDuty, updateDuty,
    createUser,
    assignDutyToTeacher,
    assignTutor,
    getDashboardStats,
    getYearDrops,
    updateYearDropStatus,
    getUsers,
    unassignDuty,
    deleteUser,
    updateUserAdmin
};
