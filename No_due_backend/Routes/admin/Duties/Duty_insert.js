const express = require("express");
const db = require("../../../Database/db");
const router = express.Router();

router.post("/",(req,res)=>{
    
    const{duties}=req.body
    const sql="INSERT INTO duty_insert(duty) VALUES(?)";
    db.query(sql,[duties],(err,result)=>{
        if(err){
            console.error(err);
        return res.status(500).json({err : "falid to insert"});
        }
        else{
            return res.json({
             success: true,
             message: `"${duties}" inserted successfully`
        });
        }
    })
})
module.exports=router;