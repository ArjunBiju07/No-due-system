const pool = require('../config/db');

const getMyStatus = async (req, res) => {
    const userId = req.user.id;

    try {
        const [students] = await pool.execute('SELECT id FROM students WHERE user_id = ?', [userId]);
        if (students.length === 0) return res.status(404).json({ message: 'Student not found' });

        const studentId = students[0].id;

        // Get ALL duties that exist
        const [allDuties] = await pool.execute('SELECT id FROM duties');

        // Auto-create missing clearance rows for this student
        if (allDuties.length > 0) {
            const placeholders = allDuties.map(d => `(${studentId}, ${d.id}, 'cleared')`).join(', ');
            await pool.execute(
                `INSERT IGNORE INTO student_clearance_status (student_id, duty_id, status) VALUES ${placeholders}`
            );
        }

        // Now fetch all clearance records (including newly created ones)
        const [clearance] = await pool.execute(`
            SELECT sc.*, d.name as duty_name
            FROM student_clearance_status sc
            JOIN duties d ON sc.duty_id = d.id
            WHERE sc.student_id = ?
        `, [studentId]);

        const [studentInfo] = await pool.execute(`
            SELECT s.*, u.username, u.email, d.name as department_name, ay.year_range,
            (SELECT status FROM year_drops WHERE student_id = s.id AND status = 'approved' LIMIT 1) as year_drop_status
            FROM students s
            JOIN users u ON s.user_id = u.id
            JOIN departments d ON s.department_id = d.id
            JOIN academic_years ay ON s.academic_year_id = ay.id
            WHERE s.id = ?
        `, [studentId]);

        res.json({
            info: studentInfo[0],
            clearance: clearance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const applyForClearance = async (req, res) => {
    const userId = req.user.id;

    try {
        await pool.execute(
            'UPDATE students SET current_status = "in_progress" WHERE user_id = ? AND current_status IN ("pending", "rejected")',
            [userId]
        );
        res.json({ message: 'Applied for clearance' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const submitYearDrop = async (req, res) => {
    const userId = req.user.id;
    const { reason, last_semester, current_year } = req.body;

    try {
        const [students] = await pool.execute('SELECT id FROM students WHERE user_id = ?', [userId]);
        if (students.length === 0) return res.status(404).json({ message: 'Student not found' });

        const studentId = students[0].id;

        await pool.execute(
            'INSERT INTO year_drops (student_id, reason, last_semester, current_year) VALUES (?, ?, ?, ?)',
            [studentId, reason, last_semester, current_year]
        );

        res.json({ message: 'Year drop request submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePhoto = async (req, res) => {
    const userId = req.user.id;
    if (!req.file) {
        return res.status(400).json({ message: 'No photo provided' });
    }

    try {
        const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        await pool.execute(
            'UPDATE students SET photo = ? WHERE user_id = ?',
            [photoUrl, userId]
        );
        res.json({ message: 'Photo updated successfully', photo: photoUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMyStatus, applyForClearance, submitYearDrop, updatePhoto };
