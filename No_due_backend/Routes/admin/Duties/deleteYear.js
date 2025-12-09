const express = require("express");
const db = require("../../../Database/db");
const router = express.Router();

// ✅ POST /Year/Delete
router.post("/", (req, res) => {
  const { id } = req.body;

  // ✅ Validation
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Year ID is required",
    });
  }

  // ✅ Delete only selected year
  const sql = "DELETE FROM academicYear WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DB DELETE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to delete year",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Year not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Academic Year deleted successfully",
    });
  });
});

module.exports = router;
