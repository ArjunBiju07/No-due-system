const express = require("express");
const db = require("../../Database/db");
const router = express.Router();

router.post('/',(req,res)=>{
  const {name , password }=req.body;
  console.log(name, password);

  const sql="select * from login where Name = ? and password = ?";
  db.query(sql,[name , password],(err,result)=>{
    if(err){
      console.log("Databse Error",err);
      return res.status(500).json({
        success: false,
        message: "Error in database",
      });
    }
    if(result.length > 0){
      console.log("Login successful");
        return res.status(200).json({
        success: true,
        message: "Login successfully completed",
      });
    }
    else{
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }
  });
});


module.exports = router;
         