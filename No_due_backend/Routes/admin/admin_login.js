const express = require("express");
const db = require("../../Database/db");
const router = express.Router();

router.post("/", (req, res) => {
    const { adminid, password } = req.body;
    if (!adminid || !password) {
        return res.send({
            success: false,
            message: "Admin ID and password are required",
        });
    }
    const sql = "SELECT * FROM users WHERE username = ? AND password_hash = ?";
    db.query(sql, [adminid, password], (err, result) => {
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
                message: "Invalid Admin ID or password",
            })
        }
    });
});

module.exports = router;
