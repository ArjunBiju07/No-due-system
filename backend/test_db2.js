const mysql = require('mysql2/promise');
require('dotenv').config();
async function run() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'nodue_db'
        });
        const [assignments] = await pool.query('SELECT * FROM tutor_assignments');
        console.log('Tutor Assignments:', assignments);
        const [students] = await pool.query('SELECT s.id, s.department_id, s.academic_year_id FROM students s');
        console.log('Students:', students);
        
        // Let's test the specific query
        const [studentInfo] = await pool.execute(`
            SELECT s.*,
            (SELECT tu.username FROM tutor_assignments ta JOIN users tu ON ta.user_id = tu.id WHERE ta.department_id = s.department_id AND ta.academic_year_id = s.academic_year_id LIMIT 1) as tutor_name
            FROM students s
        `);
        console.log('Student Info:', studentInfo);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
