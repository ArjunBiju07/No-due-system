const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodue"
});

db.connect((err)=>{
    if(err){
        console.error("Database connection error failed:",err.message);
    }
    else{
        console.log("connected to MYSQL Database");
    }
});

module.exports = db;