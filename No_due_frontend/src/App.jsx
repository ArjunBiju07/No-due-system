import React from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Admin_login from "./admin/Admin_login";
import Admin_dashboard from "./admin/Admin_dashboard";
import Admin_about from "./admin/Admin_about";
import Admin_contact from "./admin/Admin_contact";
import Admin_profile from "./admin/Admin_profile";

import Staff_login from "./staff/Staff_login";
import Staff_dashboard from "./staff/Staff_dashboard";
import Staff_about from "./staff/Staff_about";
import Staff_contact from "./staff/Staff_contact";
import Staff_profile from "./staff/Staff_profile";

import Select_role from "./Select_role";
import Student_login from "./student/Student_login";
import Student_dashboard from "./student/Student_dashboard";
import Student_about from "./student/Student_about";
import Student_contact from "./student/Student_contact";
import Student_profile from "./student/Student_profile";
import Student_applynodue from "./student/Student_applynodue";
import Student_status from "./student/Student_status";
import Student_complete from "./student/Student_complete";
import Student_drop from "./student/Student_drop";



function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin_login" element={<Admin_login />}></Route>
        <Route path="/admin_dashboard" element={<Admin_dashboard />}></Route>
        <Route path="/admin_about" element={<Admin_about />}></Route>
        <Route path="/admin_contact" element={<Admin_contact />}></Route>
        <Route path="/admin_profile" element={<Admin_profile />}></Route>

        <Route path="/staff_login" element={<Staff_login />}></Route>
        <Route path="/staff_dashboard" element={<Staff_dashboard />}></Route>
        <Route path="/staff_about" element={<Staff_about />}></Route>
        <Route path="/staff_contact" element={<Staff_contact />}></Route>
        <Route path="/staff_profile" element={<Staff_profile />}></Route>

        <Route path="/" element={<Select_role />}></Route>
        <Route path="/student_login" element={<Student_login />}></Route>
        <Route path="/student_dashboard" element={<Student_dashboard />}></Route>
        <Route path="/student_about" element={<Student_about />}></Route>
        <Route path="/student_contact" element={<Student_contact />}></Route>
        <Route path="/student_profile" element={<Student_profile />}></Route>
        <Route path="/student_applynodue" element={<Student_applynodue />}></Route>
        <Route path="/student_status" element={<Student_status />}></Route>
        <Route path="/student_complete" element={<Student_complete />}></Route>
        <Route path="/student_drop" element={<Student_drop />}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
