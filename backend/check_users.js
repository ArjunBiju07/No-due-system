const pool = require('./config/db');

async function checkUsers() {
    try {
        const [rows] = await pool.execute('SELECT role, COUNT(*) as count FROM users GROUP BY role');
        console.log('User Role Counts:', rows);
        
        const [faculty] = await pool.execute("SELECT id, username, role FROM users WHERE role IN ('teacher', 'both')");
        console.log('Faculty (teacher/both):', faculty);
        
        const [tutors] = await pool.execute("SELECT id, username, role FROM users WHERE role IN ('tutor', 'both')");
        console.log('Tutors (tutor/both):', tutors);
        
        const [duties] = await pool.execute("SELECT d.name, tda.user_id FROM teacher_duty_assignments tda JOIN duties d ON tda.duty_id = d.id");
        console.log('Duty Assignments:', duties);
    } catch (err) {
        console.error('Error checking users:', err.message);
    } finally {
        process.exit();
    }
}

checkUsers();
