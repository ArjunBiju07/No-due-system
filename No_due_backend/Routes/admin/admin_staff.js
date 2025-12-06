const express = require("express");
const db = require("../../Database/db");
const router = express.Router();

router.post('/',(req,res)=>{
const {name , username, duty} = req.body
const dutyString = duty.join(",");
const sql="insert into staff_insert (name , username , duty ) values(?,?,?)";
db.query(sql,[name , username, dutyString] , (err,result)=>{
    if(err){
        console.error(err);
        return res.status(500).json({err : "falid to insert"});
    }
return res.json({
  success: true,
  message: `Name "${name}" inserted successfully`
});

    
})
})
module.exports = router;