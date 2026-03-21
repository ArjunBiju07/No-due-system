const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/departments', async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM departments');
    res.json(rows);
});

router.get('/academic-years', async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM academic_years');
    res.json(rows);
});

module.exports = router;
