import React from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Admin_login from "./admin/Admin_login"; // import hari
import AdminHome from "./admin/AdminHome";  {/*import hari */}
import AdminStaff from "./admin/AdminStaff";  {/*import hari */}
import StaffList from "./admin/StaffList";

import DutyAdd from "./admin/Duties/adminDuty";

import Student_login from "./student/Student_login";
import Student_dashboard from "./student/Student_dashboard";
 
function App() {


  return (
    <BrowserRouter>
<ToastContainer
  position="top-center"
  autoClose={1500}
  newestOnTop
/>

      <Routes>
        <Route path="/" element={<Admin_login />} />  
        <Route path='/admin/Home' element={<AdminHome />} />  
        <Route path='/admin/Staff' element={<AdminStaff />} /> 
       <Route path="/Staff/List" element={<StaffList />} />   

        <Route path="/Admin/Duty" element={<DutyAdd />} />
        
        <Route path="/student_login" element={<Student_login />} />
        <Route path="/student_dashboard" element={<Student_dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App