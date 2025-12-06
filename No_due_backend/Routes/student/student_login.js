const express = require("express");
const db = require("../../Database/db");
const router = express.Router();

router.post("/", (req, res) => {
    const { adno, password } = req.body;
    if (!adno || !password) {
        return res.send({
            success: false,
            message: "Admission number and password are required",
        });
    }
    const sql = "SELECT * FROM students WHERE admission_no = ? AND password = ?";
    db.query(sql, [adno, password], (err, result) => {
         if(err){
            console.error("Database error: ", err);
            return res.send({success:false,message:"Error in database"});
        }

        if(result.length > 0){
            return res.send({success: true,
                 message: "Login successful"});

        }else{
            return res.send({
                success: false,
                message: "Invalid username or password",
            })
        }
    });
});

module.exports = router;
