import React from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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

import Admin_login from "./admin/Admin_login";


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Select_role />}></Route>
        {/* <Route path="/admin_login" element={<Admin_login />}></Route> */}
        <Route path="/student_login" element={<Student_login />}></Route>
        <Route path="/student_dashboard" element={<Student_dashboard />}></Route>
        <Route path="/student_about" element={<Student_about />}></Route>
        <Route path="/student_contact" element={<Student_contact />}></Route>
        <Route path="/student_profile" element={<Student_profile />}></Route>
        <Route path="/student_applynodue" element={<Student_applynodue />}></Route>
        <Route path="/student_status" element={<Student_status />}></Route>
        <Route path="/student_complete" element={<Student_complete />}></Route>
        <Route path="/student_drop" element={<Student_drop />}></Route>

        <Route path="/admin_login" element={<Admin_login />}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
