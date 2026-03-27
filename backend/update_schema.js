const mysql = require('mysql2/promise');
async function update() {
    const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'nodue_db' });
    try {
        // Since ALTER TABLE ADD COLUMN IF NOT EXISTS is only available in MariaDB or newer MySQL versions,
        // we'll check if the column exists first for safety or just catch the error.
        
        try { await pool.execute('ALTER TABLE students ADD COLUMN year_of_study VARCHAR(50) DEFAULT "Final Year"'); } catch(e) {}
        try { await pool.execute('ALTER TABLE students ADD COLUMN course_completed BOOLEAN DEFAULT TRUE'); } catch(e) {}
        try { await pool.execute('ALTER TABLE students ADD COLUMN reason_for_request TEXT'); } catch(e) {}
        
        console.log('Database schema updated for new PDF fields');
    } catch(e) { console.error(e); }
    process.exit(0);
}
update();
