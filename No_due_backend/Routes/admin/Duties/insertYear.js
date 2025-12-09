const express = require("express");
const db = require("../../../Database/db");
const router = express.Router();

router.post("/", (req, res) => {
  const { year } = req.body;

  if (!year || year.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Academic year is required",
    });
  }

  const sql = "INSERT INTO academicYear (acYear) VALUES (?)";

  db.query(sql, [year], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to insert academic year",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Academic year added successfully",
    });
  });
});

module.exports = router;
