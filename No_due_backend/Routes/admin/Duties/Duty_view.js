const express=require('express');
const db=require("../../../Database/db");
const router = express.Router();

router.get('/',(req,res)=>{
    const sql="SELECT * FROM duty_insert";
    db.query(sql,(err,result)=>{
        if(err){
            console.log("DB ERROR")
        return res.status(500).json({
        success: false,
        message: "Error in database",
      });
    }else{
         return res.status(200).send(result)
    }
    })
})
module.exports=router;