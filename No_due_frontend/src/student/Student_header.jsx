import React from 'react'
import logo from "../assets/logo.png"

function Student_header() {
  return (
    <div className="header shadow-sm py-2 px-3" style={{ backgroundColor: "#0d6efd" }}>

      <div className="d-flex justify-content-between align-items-center text-white">

        <div className="d-flex align-items-center header-left">
          <img
            src={logo}
            alt="College Logo"
            className="me-2"
            style={{ width: '55px', background: "white", borderRadius: "5px" }}
          />

          <div className="college-details" style={{ lineHeight: "1.4" }}>
            <p className="mb-0 fw-bold" style={{ fontSize: "14px" }}>
              Govt. Polytechnic College Purappuzha
            </p>
            <p className="mb-0" style={{ fontSize: "12px" }}>
              Purappuzha P.O, Idukki Dt, Kerala
            </p>
            <p className="mb-0" style={{ fontSize: "12px" }}>
              Phone: 0481-2562253 | Email:
            </p>
          </div>
        </div>

        <div className="link-bar d-flex align-items-center gap-2">
          <a href="/student_dashboard" className="text-decoration-none small text-white">Home</a>
          <a href="/student_about" className="text-decoration-none small text-white">About</a>
          <a href="/contact" className="text-decoration-none small text-white">Contact</a>
          <a href="/contact" className="text-decoration-none small text-white">Profile</a>
        </div>
      </div>


      <h4 className="text-center  fw-bold" style={{ fontSize: "40px", color: "white" }}>
        No Due Clearence System
      </h4>
    </div>
  )
}

export default Student_header
