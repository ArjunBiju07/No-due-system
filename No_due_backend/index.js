const express = require('express');
const cors = require('cors');
const app = express();

const Login = require("./Routes/student/student_login");
const Admin_Login = require("./Routes/admin/admin_login");

app.use(express.json());
app.use(cors());

app.use('/login',Login);
app.use('/admin/login',Admin_Login);

app.listen(3000, () => {
    console.log("Server is up ")
});