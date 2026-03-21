const pool = require('../config/db');

const getAssignedStudents = async (req, res) => {
    const userId = req.user.id;

    try {
        const [assignments] = await pool.execute(
            'SELECT department_id, academic_year_id FROM tutor_assignments WHERE user_id = ?',
            [userId]
        );

        if (assignments.length === 0) {
            return res.json([]);
        }

        const { department_id, academic_year_id } = assignments[0];

        const [students] = await pool.execute(`
            SELECT s.*, u.username, u.email
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.department_id = ? AND s.academic_year_id = ?
        `, [department_id, academic_year_id]);

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudentClearanceSummary = async (req, res) => {
    const { student_id } = req.params;

    try {
        const [clearance] = await pool.execute(`
            SELECT sc.*, d.name as duty_name
            FROM student_clearance_status sc
            JOIN duties d ON sc.duty_id = d.id
            WHERE sc.student_id = ?
        `, [student_id]);

        res.json(clearance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const finalApproval = async (req, res) => {
    const { student_id, status } = req.body;

    try {
        if (status === 'cleared') {
            // Check if all duties are cleared
            const [pending] = await pool.execute(
                'SELECT * FROM student_clearance_status WHERE student_id = ? AND status != "cleared"',
                [student_id]
            );

            if (pending.length > 0) {
                return res.status(400).json({ message: 'All duties must be cleared before final approval' });
            }
        }

        await pool.execute(
            'UPDATE students SET current_status = ? WHERE id = ?',
            [status, student_id]
        );

        res.json({ message: `Final clearance ${status === 'cleared' ? 'approved' : 'rejected'}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getYearDrops = async (req, res) => {
    const userId = req.user.id;
    try {
        const [assignments] = await pool.execute(
            'SELECT department_id, academic_year_id FROM tutor_assignments WHERE user_id = ?',
            [userId]
        );

        if (assignments.length === 0) {
            return res.json([]);
        }

        const { department_id, academic_year_id } = assignments[0];

        const [rows] = await pool.execute(`
            SELECT yd.*, s.register_number, u.username, d.name as department_name, ay.year_range, u.email, s.photo
            FROM year_drops yd
            JOIN students s ON yd.student_id = s.id
            JOIN users u ON s.user_id = u.id
            JOIN departments d ON s.department_id = d.id
            JOIN academic_years ay ON s.academic_year_id = ay.id
            WHERE s.department_id = ? AND s.academic_year_id = ?
            ORDER BY yd.created_at DESC
        `, [department_id, academic_year_id]);
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

const deleteYearDrop = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM year_drops WHERE id = ?', [id]);
        res.json({ message: 'Year drop record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTutorStats = async (req, res) => {
    const userId = req.user.id;
    try {
        const [assignments] = await pool.execute(
            `SELECT ta.department_id, ta.academic_year_id, d.name as department_name, ay.year_range 
             FROM tutor_assignments ta
             JOIN departments d ON ta.department_id = d.id
             JOIN academic_years ay ON ta.academic_year_id = ay.id
             WHERE ta.user_id = ?`,
            [userId]
        );

        if (assignments.length === 0) {
            return res.json({ total: 0, cleared: 0, pending: 0, yearDrops: 0, department_name: 'None', year_range: 'N/A' });
        }

        const { department_id, academic_year_id, department_name, year_range } = assignments[0];

        const [[{ total }]] = await pool.execute(
            'SELECT COUNT(*) as total FROM students WHERE department_id = ? AND academic_year_id = ?',
            [department_id, academic_year_id]
        );

        const [[{ cleared }]] = await pool.execute(
            'SELECT COUNT(*) as cleared FROM students WHERE department_id = ? AND academic_year_id = ? AND current_status = "cleared"',
            [department_id, academic_year_id]
        );

        const [[{ pending }]] = await pool.execute(
            'SELECT COUNT(*) as pending FROM students WHERE department_id = ? AND academic_year_id = ? AND current_status != "cleared"',
            [department_id, academic_year_id]
        );

        const [[{ yearDrops }]] = await pool.execute(
            'SELECT COUNT(*) as yearDrops FROM year_drops yd JOIN students s ON yd.student_id = s.id WHERE s.department_id = ? AND s.academic_year_id = ? AND yd.status = "pending"',
            [department_id, academic_year_id]
        );

        res.json({ total, cleared, pending, yearDrops, department_name, year_range });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getAssignedStudents, 
    getStudentClearanceSummary, 
    finalApproval,
    getYearDrops,
    updateYearDropStatus,
    deleteYearDrop,
    getTutorStats
};
