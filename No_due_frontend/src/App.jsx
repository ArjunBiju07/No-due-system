import React from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Admin_login from "./admin/Admin_login"; // import hari
import AdminHome from "./admin/AdminHome";  {/*import hari */}
import AdminTutor from "./admin/AdminTutor";  {/*import hari */}
import AdminStaff from "./admin/AdminStaff";  {/*import hari */}
import StaffList from "./admin/StaffList";  {/*Staff list */}
import Student_login from "./student/Student_login";
import Student_dashboard from "./student/Student_dashboard";
 
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Admin_login />} />  {/*import hari */}
        <Route path='/admin/Home' element={<AdminHome />} />  {/*import hari */}
        <Route path='/admin/Tutor' element={<AdminTutor />} /> {/*import hari */}
        <Route path='/admin/Staff' element={<AdminStaff />} />    {/*import hari */}   
       <Route path="/Staff/List" element={<StaffList />} />   {/*staffList */}
        <Route path="/student_login" element={<Student_login />} />
        <Route path="/student_dashboard" element={<Student_dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App