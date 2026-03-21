const pool = require('./config/db');

async function checkDeleteRules() {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                CONSTRAINT_NAME, 
                TABLE_NAME, 
                DELETE_RULE
            FROM 
                INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
            WHERE 
                CONSTRAINT_SCHEMA = 'nodue_db';
        `);
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDeleteRules();
