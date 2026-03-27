const pool = require('../config/db');
const puppeteer = require('puppeteer');

const getMyStatus = async (req, res) => {
    const userId = req.user.id;

    try {
        const [students] = await pool.execute('SELECT id FROM students WHERE user_id = ?', [userId]);
        if (students.length === 0) return res.status(404).json({ message: 'Student not found' });

        const studentId = students[0].id;

        // Get ALL duties that exist
        const [allDuties] = await pool.execute('SELECT id FROM duties');

        // Auto-create missing clearance rows for this student
        if (allDuties.length > 0) {
            const placeholders = allDuties.map(d => `(${studentId}, ${d.id}, 'cleared')`).join(', ');
            await pool.execute(
                `INSERT IGNORE INTO student_clearance_status (student_id, duty_id, status) VALUES ${placeholders}`
            );
        }

        // Now fetch all clearance records (including newly created ones)
        const [clearance] = await pool.execute(`
            SELECT sc.*, d.name as duty_name
            FROM student_clearance_status sc
            JOIN duties d ON sc.duty_id = d.id
            WHERE sc.student_id = ?
        `, [studentId]);

        const [studentInfo] = await pool.execute(`
            SELECT s.*, u.username, u.email, d.name as department_name, ay.year_range,
            (SELECT status FROM year_drops WHERE student_id = s.id ORDER BY id DESC LIMIT 1) as year_drop_status,
            (SELECT tu.username FROM tutor_assignments ta JOIN users tu ON ta.user_id = tu.id WHERE ta.department_id = s.department_id AND ta.academic_year_id = s.academic_year_id LIMIT 1) as tutor_name
            FROM students s
            JOIN users u ON s.user_id = u.id
            JOIN departments d ON s.department_id = d.id
            JOIN academic_years ay ON s.academic_year_id = ay.id
            WHERE s.id = ?
        `, [studentId]);

        res.json({
            info: studentInfo[0],
            clearance: clearance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const applyForClearance = async (req, res) => {
    const userId = req.user.id;

    try {
        const [students] = await pool.execute('SELECT id, current_status FROM students WHERE user_id = ?', [userId]);
        if (students.length === 0) return res.status(404).json({ message: 'Student not found' });
        const studentId = students[0].id;

        const [yearDrops] = await pool.execute('SELECT status FROM year_drops WHERE student_id = ? ORDER BY id DESC LIMIT 1', [studentId]);
        if (yearDrops.length > 0 && ['pending', 'approved'].includes(yearDrops[0].status)) {
            return res.status(400).json({ message: 'Cannot apply for No Due Certificate while a Course Drop request is active.' });
        }

        await pool.execute(
            'UPDATE students SET current_status = "in_progress" WHERE user_id = ? AND (current_status IN ("pending", "rejected", "") OR current_status IS NULL)',
            [userId]
        );
        res.json({ message: 'Applied for clearance' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const submitYearDrop = async (req, res) => {
    const userId = req.user.id;
    const { reason, last_semester, current_year } = req.body;

    try {
        const [students] = await pool.execute('SELECT id, current_status FROM students WHERE user_id = ?', [userId]);
        if (students.length === 0) return res.status(404).json({ message: 'Student not found' });

        const student = students[0];
        if (['in_progress', 'cleared'].includes(student.current_status)) {
            return res.status(400).json({ message: 'Cannot apply for Course Drop while a No Due Certificate request is active.' });
        }

        const studentId = student.id;

        await pool.execute(
            'INSERT INTO year_drops (student_id, reason, last_semester, current_year) VALUES (?, ?, ?, ?)',
            [studentId, reason, last_semester, current_year]
        );

        res.json({ message: 'Year drop request submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePhoto = async (req, res) => {
    const userId = req.user.id;
    if (!req.file) {
        return res.status(400).json({ message: 'No photo provided' });
    }

    try {
        const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        await pool.execute(
            'UPDATE students SET photo = ? WHERE user_id = ?',
            [photoUrl, userId]
        );
        res.json({ message: 'Photo updated successfully', photo: photoUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const downloadClearancePDF = async (req, res) => {
    const userId = req.user.id;
    try {
        const [students] = await pool.execute('SELECT id FROM students WHERE user_id = ?', [userId]);
        if (students.length === 0) return res.status(404).json({ message: 'Student not found' });
        const studentId = students[0].id;

        const [studentInfoRows] = await pool.execute(`
            SELECT s.*, u.username, u.email, d.name as department_name, ay.year_range,
                   sc.date_of_admission, sc.total_working_days, sc.days_attended, sc.last_date_of_attendance, sc.conduct_character, sc.mentor_recommendation
            FROM students s
            JOIN users u ON s.user_id = u.id
            JOIN departments d ON s.department_id = d.id
            JOIN academic_years ay ON s.academic_year_id = ay.id
            LEFT JOIN student_conduct sc ON s.id = sc.student_id
            WHERE s.id = ?
        `, [studentId]);
        const info = studentInfoRows[0];

        if (info.current_status !== 'cleared') {
             return res.status(400).json({ message: 'Clearance not yet approved' });
        }

        const currentYear = new Date().getFullYear();

        const [clearance] = await pool.execute(`
            SELECT sc.*, d.name as duty_name
            FROM student_clearance_status sc
            JOIN duties d ON sc.duty_id = d.id
            WHERE sc.student_id = ?
        `, [studentId]);

        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: black; background: white; }
                    .certificate-container { padding: 40px; position: relative; background: white; }
                    .header { text-align: center; border-bottom: 2px solid black; padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { font-size: 38px; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
                    .sub-header { font-size: 18px; margin-top: 10px; font-style: italic; font-weight: bold; }
                    .section { margin-bottom: 25px; }
                    .row { display: flex; margin-bottom: 12px; }
                    .label { width: 300px; font-weight: bold; color: black; }
                    .value { flex: 1; border-bottom: 1px dotted #94a3b8; padding-bottom: 2px; }
                    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    .table th, .table td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
                    .table th { background-color: #f8fafc; color: black; font-size: 12px; text-transform: uppercase; }
                    .footer { margin-top: 60px; display: flex; justify-content: space-between; gap: 20px; }
                    .seal { border: 2px solid black; width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 10px; font-weight: bold; padding: 10px; color: #94a3b8; opacity: 0.5; }
                    .signature { text-align: center; width: 220px; }
                    .signature div { border-top: 2px solid black; margin-top: 40px; padding-top: 5px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="certificate-container">
                    <div class="header">
                        <h1>No Due Certificate</h1>
                        <div><h2>GOVERNMENT POLYTECHNIC COLLEGE, PURAPUZHA</h2>
                            <p>APPLICATION FOR SSLC BOOK/TRANSFER CERTIFICATE/COURSE AND CONDUCT CERTIFICATE/CAUTION DEPOSIT FOR YEAR ${currentYear}</p>
                        </div>
                    </div>

                    <div class="section">
                        <div class="row"><div class="label">Name of Student</div><div class="value">: ${info.username}</div></div>
                        <div class="row"><div class="label">Admission No</div><div class="value">: ${info.admission_number || 'N/A'}</div></div>
                        <div class="row"><div class="label">Date of Birth</div><div class="value">: ${info.dob ? new Date(info.dob).toLocaleDateString() : 'N/A'}</div></div>
                        <div class="row"><div class="label">Department</div><div class="value">: ${info.department_name}</div></div>
                        <div class="row"><div class="label">Class in which last studied</div><div class="value">: ${info.year_range}</div></div>
                        <div class="row"><div class="label">Year of Study</div><div class="value">: ${info.year_range}</div></div>
                        <div class="row"><div class="label">Course Completed or Not</div><div class="value">: ${info.course_completed ? 'Yes' : 'No'}</div></div>
                        <div class="row"><div class="label">Reason for request</div><div class="value">: ${info.reason_for_request || 'TC Verification'}</div></div>
                        <div class="row"><div class="label">Signature of Student</div><div class="value">:</div></div>
                    </div>

                    <div class="section" style="margin-top: 40px;">
                        <h3 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; text-transform: uppercase;"><u>Report of Dues</u></h3>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Department/Duty</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${clearance.map(c => `
                                    <tr>
                                        <td>${c.duty_name}</td>
                                        <td style="color: black; font-weight: bold;">NO DUE</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="section" style="margin-top: 40px;">
                        <h3 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; text-transform: uppercase;"><u>Class Tutor's Remarks</u></h3>
                        <div class="row"><div class="label">Date of admission</div><div class="value">: ${info.date_of_admission ? new Date(info.date_of_admission).toLocaleDateString() : 'N/A'}</div></div>
                        <div class="row"><div class="label">Total Working Days</div><div class="value">: ${info.total_working_days || '0'}</div></div>
                        <div class="row"><div class="label">Days Attended</div><div class="value">: ${info.days_attended || '0'}</div></div>
                        <div class="row"><div class="label">Last Date of Attendance</div><div class="value">: ${info.last_date_of_attendance ? new Date(info.last_date_of_attendance).toLocaleDateString() : 'N/A'}</div></div>
                        <div class="row"><div class="label">Conduct and Character</div><div class="value">: ${info.conduct_character || 'Good'}</div></div>
                        <div class="row"><div class="label">Mentor Recommendation</div><div class="value">: ${info.mentor_recommendation || 'Satisfactory'}</div></div>
                    </div>

                    <div class="footer">
                        <div>COLLEGE SEAL<br>(OFFICIAL)</div>
                        <div class="signature"><div>Superintendent</div></div>
                        <div class="signature"><div>Principal</div></div>
                    </div>
                </div>
            </body>
            </html>
        `;

        await page.setContent(html);
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=TC_${info.register_number}.pdf`,
            'Content-Length': pdfBuffer.length
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMyStatus, applyForClearance, submitYearDrop, updatePhoto, downloadClearancePDF };

