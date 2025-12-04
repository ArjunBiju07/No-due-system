import React from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Select_role from "./Select_role";
import Admin_login from "./admin/Admin_login";
import Student_login from "./student/Student_login";
import Student_dashboard from "./student/Student_dashboard";
import Student_about from "./student/Student_about";
import Student_applynodue from "./student/Student_applynodue";
import Student_status from "./student/Student_status";

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Select_role />}></Route>
        <Route path="/admin_login" element={<Admin_login />}></Route>
        <Route path="/student_login" element={<Student_login />}></Route>
        <Route path="/student_dashboard" element={<Student_dashboard />}></Route>
        <Route path="/student_about" element={<Student_about />}></Route>
        <Route path="/student_applynodue" element={<Student_applynodue />}></Route>
        <Route path="/student_status" element={<Student_status />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
