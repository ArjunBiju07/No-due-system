import React from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Login from "./admin/Login";

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
