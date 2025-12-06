const express = require('express');
const cors = require('cors');
const app = express();

const Login = require("./Routes/student/student_login");
const Course_drop = require("./Routes/student/course_drop")

app.use(express.json());
app.use(cors());

app.use('/login',Login);
app.use('/course_drop',Course_drop);

app.listen(3000, () => {
    console.log("Server is up ")
});