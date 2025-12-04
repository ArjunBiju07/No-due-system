const express = require('express');
const db = require('../../Database/db');
const router = express.Router();

router.post('/', (req, res) => {
    const { adno, password } = req.body;

    if (!adno || !password) {
        return res.status(400).json({ message: "Admission No and Password required" });
    }

    const sql = "SELECT * FROM st_registration WHERE adno = ? AND password = ?";

    db.query(sql, [adno, password], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        // If no user found
        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid Admission Number or Password" });
        }

        // Login Success
        return res.json({
            message: "Login successful",
            user: result[0]   // sending user data
        });
    });
});

module.exports = router;
