import React from 'react';
import logo from './assets/logo.png';

function Header() {
  return (
    <div className="header shadow-sm py-2 px-3" style={{ backgroundColor: "#0d6efd" }}>

      {/* Top Row */}
      <div className="d-flex justify-content-between align-items-center text-white">

        {/* Logo + College Details */}
        <div className="d-flex align-items-center header-left">
          <img
            src={logo}
            alt="College Logo"
            className="me-2"
            style={{ width: '55px', background: "white", borderRadius: "5px" }}
          />

          <div className="college-details" style={{ lineHeight: "1.1" }}>
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

        {/* Links */}
        <div className="link-bar d-flex align-items-center gap-2">
          <span><ion-icon name="home" style={{ color: "white" }}></ion-icon></span>
          <a href="/" className="text-decoration-none small text-white">Home</a>

          <span><ion-icon name="accessibility" style={{ color: "white" }}></ion-icon></span>
          <a href="/about" className="text-decoration-none small text-white">About</a>

          <span><ion-icon name="call" style={{ color: "white" }}></ion-icon></span>
          <a href="/contact" className="text-decoration-none small text-white">Contact</a>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-center mt-2 fw-bold" style={{ fontSize: "40px", color: "white" }}>
        No Due Clearence System
      </h4>
    </div>
  );
}

export default Header;
