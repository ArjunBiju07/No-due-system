const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = async (req, res) => {
    const { username, email, password, department_id, academic_year_id, register_number, admission_number, dob } = req.body;
    let photoUrl = null;
    if (req.file) {
        photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    try {
        // Check if user exists
        const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const [userResult] = await pool.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, 'student']
        );
        const userId = userResult.insertId;

        // Create student record
        await pool.execute(
            'INSERT INTO students (user_id, department_id, academic_year_id, register_number, admission_number, dob, photo) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, department_id, academic_year_id, register_number, admission_number || null, dob || null, photoUrl]
        );

        // Get student ID
        const [studentRows] = await pool.execute('SELECT id FROM students WHERE user_id = ?', [userId]);
        const studentId = studentRows[0].id;

        // Initialize clearance status for all duties
        const [duties] = await pool.execute('SELECT id FROM duties');
        for (const duty of duties) {
            await pool.execute(
                'INSERT INTO student_clearance_status (student_id, duty_id, status) VALUES (?, ?, ?)',
                [studentId, duty.id, 'cleared']
            );
        }

        res.status(201).json({
            id: userId,
            username,
            email,
            role: 'student',
            token: generateToken(userId, 'student'),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const resetPasswordDirect = async (req, res) => {
    const admission_number = req.body.admission_number?.trim();
    const dob = req.body.dob?.trim();
    const new_password = req.body.new_password;
    
    console.log(`Reset attempt - Adm: "${admission_number}", DOB: "${dob}"`);

    try {
        // Find student by admission number and dob
        // String comparison in MySQL is case-insensitive by default in most collations, 
        // but explicitly trimming and ensuring date format is safer.
        const [students] = await pool.execute(
            'SELECT user_id FROM students WHERE admission_number = ? AND DATE(dob) = ?',
            [admission_number, dob]
        );

        console.log(`Query found ${students.length} matching students`);

        if (students.length === 0) {
            return res.status(404).json({ message: 'No student found with these credentials. Please ensure your Admission Number and Date of Birth are exactly as registered.' });
        }

        const userId = students[0].user_id;

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        // Update user password
        await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
        
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerStudent, loginUser, resetPasswordDirect };
