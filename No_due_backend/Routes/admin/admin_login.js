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
      return res.json({success : false , message: "Error in database"});
    }
    if(result.length > 0){
      console.log("Login successful");
      return res.json({success: true , message: "Login successfully complited"});
    }
    else{
      console.log("Invalid username or password");
      return res.json({success: false , message: "Inavlid username or password"});
    }
  });
});


module.exports = router;
         