const express = require("express");
const db = require("../../Database/db");
const router = express.Router();

router.post("/", (req, res) => {
  const { id } = req.body;

  const sql = "DELETE FROM staff_insert WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    // ✅ REAL ERROR HANDLING
    if (err) {
      console.log("Database Error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to delete user",
      });
    }

    // ✅ IF ID NOT FOUND
    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ SUCCESS RESPONSE (THIS WAS MISSING)
    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  });
});

module.exports = router;
