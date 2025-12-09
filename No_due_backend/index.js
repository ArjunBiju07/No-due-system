const express = require('express');
const cors = require('cors');
const app = express();

const Login = require("./Routes/student/student_login");
const Admin_Login = require("./Routes/admin/admin_login");
const Insert_staff = require("./Routes/admin/admin_staff");
const StaffList=require("./Routes/admin/staff_list");
const StaffDelete=require("./Routes/admin/staff_delete");
const DutyInsert=require("./Routes/admin/Duties/Duty_insert");
const DutyView=require("./Routes/admin/Duties/Duty_view");
const DutyDlete=require("./Routes/admin/Duties/duty_delete");
const viewYear=require("./Routes/admin/Duties/viewYear");
const yearInsert=require("./Routes/admin/Duties/insertYear");
const deleteYear=require("./Routes/admin/Duties/deleteYear");

app.use(express.json());
app.use(cors());

app.use('/login',Login);
app.use('/admin/login',Admin_Login);
app.use('/Staff/Insert', Insert_staff);
app.use('/Staff/List',StaffList);
app.use('/Staff/Delete',StaffDelete)
app.use('/Duty/Insert',DutyInsert);
app.use('/Duty/List',DutyView);
app.use('/Duty/Delete',DutyDlete);
app.use('/Year/Insert',yearInsert);
app.use('/Year/List',viewYear);
app.use('/Year/Delete',deleteYear);

app.listen(3000, () => {
    console.log("Server is up ")






















});

