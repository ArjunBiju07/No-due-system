const express = require('express');
const cors = require('cors');
const app = express();

const Login = require("./Routes/student/student_login");
const Admin_Login = require("./Routes/admin/admin_login");
const Insert_staff = require("./Routes/admin/admin_staff");
const StaffList=require("./Routes/admin/staff_list");
const StaffDelete=require("./Routes/admin/staff_delete")

app.use(express.json());
app.use(cors());

app.use('/login',Login);
app.use('/admin/login',Admin_Login);
app.use('/Staff/Insert', Insert_staff);
app.use('/Staff/List',StaffList);
app.use('/Staff/Delete',StaffDelete)

app.listen(3000, () => {
    console.log("Server is up ")
});