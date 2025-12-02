import React from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Admin_login from "./admin/Admin_login";

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Admin_login/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
