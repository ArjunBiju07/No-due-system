const mysql = require('mysql2/promise');
async function setup() {
    const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'nodue_db' });
    try {
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS student_conduct (
                student_id INT PRIMARY KEY,
                date_of_admission DATE,
                total_working_days INT,
                days_attended INT,
                last_date_of_attendance DATE,
                conduct_character VARCHAR(255),
                mentor_recommendation TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            )
        `);
        console.log('student_conduct table created or verified');
    } catch(e) { console.error(e); }
    process.exit(0);
}
setup();
