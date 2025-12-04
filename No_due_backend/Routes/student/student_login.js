const express = require("express");
const db = require("../../Database/db");
const router = express.Router();

router.post("/", (req, res) => {
    const { adno, password } = req.body;

    const sql = "SELECT * FROM st_registration WHERE adno = ? AND password = ?";
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
