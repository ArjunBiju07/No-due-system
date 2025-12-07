import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import Header from "../Header";
import "../Designs/admin/adminlogin.css";
import Bg from "../assets/Gemini_Generated_Image_5xkt985xkt985xkt.png";

function Admin_login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !password) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);

        setTimeout(() => {
          navigate("/admin/Home");
        }, 1500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Server Error:", error);
      toast.error("Server error. Please try again.");
    }
  };


  return (
    <>
      <Header />

      <div className="main-wrapper">
        <div className="split-screen-container">

          {/* LEFT PANEL */}
          <div className="left-panel">
            <div className="form-content">
              <h1>Get Started Now</h1>
              <p className="subtitle">Admin Login Dashboard</p>

              <form onSubmit={handleSubmit}>

                <div className="input-group">
                  <label>Username</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="checkbox-group">
                  <input type="checkbox" id="terms" />
                  <label htmlFor="terms">I agree to the terms & policy</label>
                </div>

                <button className="submit-btn" type="submit">
                  Login
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            <img src={Bg} alt="Admin Visual" />
          </div>

        </div>
      </div>
    </>
  );
}

export default Admin_login;
