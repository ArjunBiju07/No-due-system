const express = require('express');
const db = require("../../../Database/db");
const router = express.Router();

router.get('/', (req, res) => {
    const sql = "SELECT id, acYear AS year FROM academicyear";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("DB ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Error fetching academic years from database",
            });
        }
        // send array directly
        return res.status(200).json(result);
    });
});

module.exports = router;
