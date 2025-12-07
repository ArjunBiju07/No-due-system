const express = require('express');
const db = require("../../Database/db");
const router = express.Router();

router.post('/', (req, res) => {

    const { year, sem, reason } = req.body;
    
    if (!year || !sem || !reason) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = "INSERT INTO co_drop(year,sem,reason) VALUES(?,?,?)";

    db.query(sql, [year, sem, reason], (err, result) => {

        if (err) {
            return res.status(500).json({ error: 'Somthing went wrong.please try again later' });
        }
        else {
            return res.status(201).json({ message: 'Course droping request successfully sent' });
        }

    })
})


module.exports = router;