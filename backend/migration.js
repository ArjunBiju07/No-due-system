const pool = require('./config/db');

async function migrate() {
    try {
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS year_drops (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                reason TEXT NOT NULL,
                last_semester INT NOT NULL,
                current_year INT NOT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            )
        `);
        console.log('Migration successful: year_drops table created.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
