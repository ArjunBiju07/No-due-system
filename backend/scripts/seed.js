const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        console.log('Seeding initial data...');

        // 1. Create Departments
        const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil'];
        for (const dept of departments) {
            await pool.execute('INSERT IGNORE INTO departments (name) VALUES (?)', [dept]);
        }

        // 2. Create Academic Years
        const years = ['2023-2024', '2024-2025'];
        for (const year of years) {
            await pool.execute('INSERT IGNORE INTO academic_years (year_range) VALUES (?)', [year]);
        }

        // 3. Create Duties
        const duties = ['Library', 'Lab', 'Accounts', 'Hostel', 'Sports', 'Placement'];
        for (const duty of duties) {
            await pool.execute('INSERT IGNORE INTO duties (name) VALUES (?)', [duty]);
        }

        // 4. Create Admin User
        const adminEmail = 'admin@college.com';
        const [existingAdmin] = await pool.execute('SELECT * FROM users WHERE email = ?', [adminEmail]);

        if (existingAdmin.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await pool.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['admin', adminEmail, hashedPassword, 'admin']
            );
            console.log('Admin user created: admin@college.com / admin123');
        }

        console.log('Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();
