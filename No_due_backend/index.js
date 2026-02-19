const express = require('express');
const cors = require('cors');
const app = express();

const Admin_login = require("./Routes/admin/admin_login");

const Student_login = require("./Routes/student/student_login");
const Course_drop = require("./Routes/student/course_drop");


app.use(express.json());
app.use(cors());

app.use('/admin_login',Admin_login);

app.use('/student_login',Student_login);
app.use('/course_drop',Course_drop);


app.listen(3000, () => {
    console.log("Server is up ")
});