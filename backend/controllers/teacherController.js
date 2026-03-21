const pool = require('../config/db');

const getStudentsByDuty = async (req, res) => {
    const userId = req.user.id;
    const requestedDutyId = req.query.duty_id;

    try {
        const [assignments] = await pool.execute(`
            SELECT tda.duty_id, d.name as duty_name 
            FROM teacher_duty_assignments tda
            JOIN duties d ON tda.duty_id = d.id
            WHERE tda.user_id = ?
        `, [userId]);

        if (assignments.length === 0) {
            return res.json({ dutyName: null, students: [], allDuties: [] });
        }

        let currentAssignment;
        if (requestedDutyId) {
            currentAssignment = assignments.find(a => a.duty_id == requestedDutyId);
        }
        if (!currentAssignment) {
            currentAssignment = assignments[0];
        }

        const dutyId = currentAssignment.duty_id;
        const dutyName = currentAssignment.duty_name;

        const [students] = await pool.execute(`
            SELECT 
                s.*, 
                u.username, 
                u.email, 
                d_branch.name as branch_name,
                u_tutor.username as tutor_name,
                IFNULL(sc.status, 'cleared') as status, 
                sc.remarks
            FROM students s
            JOIN users u ON s.user_id = u.id
            JOIN departments d_branch ON s.department_id = d_branch.id
            LEFT JOIN tutor_assignments ta ON s.department_id = ta.department_id AND s.academic_year_id = ta.academic_year_id
            LEFT JOIN users u_tutor ON ta.user_id = u_tutor.id
            LEFT JOIN student_clearance_status sc ON s.id = sc.student_id AND sc.duty_id = ?
            ORDER BY u.username ASC
        `, [dutyId]);

        res.json({ dutyName, dutyId, students, allDuties: assignments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const updateStudentStatus = async (req, res) => {
    const userId = req.user.id;
    const { student_id, status, remarks, duty_id } = req.body;

    try {
        const [assignments] = await pool.execute(
            'SELECT duty_id FROM teacher_duty_assignments WHERE user_id = ? AND duty_id = ?',
            [userId, duty_id]
        );

        if (assignments.length === 0) {
            return res.status(403).json({ message: 'You are not assigned to this duty' });
        }

        await pool.execute(`
            INSERT INTO student_clearance_status (student_id, duty_id, status, remarks)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks)
        `, [student_id, duty_id, status, remarks]);

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Returns all duty statuses for a specific student, scoped to this teacher's assigned duties
const getStudentDutyStatuses = async (req, res) => {
    const userId = req.user.id;
    const studentId = parseInt(req.params.student_id, 10);

    if (!studentId) {
        return res.status(400).json({ message: 'Invalid student_id' });
    }

    try {
        const [rows] = await pool.execute(`
            SELECT 
                d.id AS duty_id,
                d.name AS duty_name,
                IFNULL(sc.status, 'cleared') AS status,
                IFNULL(sc.remarks, '') AS remarks
            FROM teacher_duty_assignments tda
            JOIN duties d ON tda.duty_id = d.id
            LEFT JOIN student_clearance_status sc 
                ON sc.duty_id = d.id AND sc.student_id = ?
            WHERE tda.user_id = ?
            ORDER BY d.name ASC
        `, [studentId, userId]);

        res.json(rows);
    } catch (error) {
        console.error('getStudentDutyStatuses error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Bulk-save multiple due/cleared statuses for one student
const updateMultipleStatuses = async (req, res) => {
    const userId = req.user.id;
    const { student_id, statuses } = req.body;

    if (!student_id || !Array.isArray(statuses) || statuses.length === 0) {
        return res.status(400).json({ message: 'student_id and non-empty statuses array are required' });
    }

    try {
        // Get all duties this teacher is authorised to manage
        const [assignments] = await pool.execute(
            'SELECT duty_id FROM teacher_duty_assignments WHERE user_id = ?',
            [userId]
        );
        // Normalise to numbers to avoid type-mismatch issues
        const allowedIds = new Set(assignments.map(a => Number(a.duty_id)));

        for (const s of statuses) {
            if (!allowedIds.has(Number(s.duty_id))) {
                return res.status(403).json({ message: `Not authorised for duty ID: ${s.duty_id}` });
            }
        }

        for (const s of statuses) {
            await pool.execute(`
                INSERT INTO student_clearance_status (student_id, duty_id, status, remarks)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks)
            `, [Number(student_id), Number(s.duty_id), s.status, s.remarks || '']);
        }

        res.json({ message: 'All statuses updated successfully' });
    } catch (error) {
        console.error('updateMultipleStatuses error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStudentsByDuty, updateStudentStatus, getStudentDutyStatuses, updateMultipleStatuses };
