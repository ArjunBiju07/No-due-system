import React from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Admin_login from "./admin/Admin_login";
import Student_login from "./student/Student_login";

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Admin_login/>}></Route>
        <Route path="/student_login" element={<Student_login/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
