const express = require('express');
const db = require('../../Database/db');
const router = express.Router();

router.get('/',(req , res)=>{
    const sql="select * from staff_insert";
    console.log(sql)
    db.query(sql,(err,result)=>{
        console.log(result)
        if(err){
            return res.status(500).send("Database Error")
        }
        return res.status(200).send(result)
    })
})
module.exports = router;