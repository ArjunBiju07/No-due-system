{/*
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../Header';
import "../Designs/admin/adminlogin.css";
import Bg from "../assets/Gemini_Generated_Image_5xkt985xkt985xkt.png";


function Admin_login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch("http://localhost:3000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
      })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);

        if (data.success) {
          navigate("/admin/Home");
          }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <>
      <Header />

       <section className="admin-login-section">
        <div>
        <form onSubmit={handleSubmit}>
          <div className="login-box">
            <h1>Admin Login</h1>

            <div className="details">
              <input
                type="text"
                required
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Username</label>
              <span className="icon">
                <ion-icon name="person-circle"></ion-icon>
              </span>
            </div>

            <div className="details">
              <input
                type="password"
                required
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
              <span className="icon">
                <ion-icon name="lock-closed-outline"></ion-icon>
              </span>
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div> x

            <button className="button-boxx" type="submit">Login</button>

          </div>
          <div>

           
          </div>
        </form>
        </div>
      </section> 
           <div className="split-screen-container">
        
     
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

              <div className="divider">
                <span>Or</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-btn">
                  <ion-icon name="logo-google"></ion-icon>
                  <span>Sign in with Google</span>
                </button>
                <button type="button" className="social-btn">
                  <ion-icon name="logo-apple"></ion-icon>
                  <span>Sign in with Apple</span>
                </button>
              </div>

              <p className="bottom-text">
                Have an account? <a href="#">Sign In</a>
              </p>
            </form>
          </div>
          </div>
         <div className="right-panel">
          
          <img 
            src={Bg} 
            alt="Monstera Leaf" 
            />
        </div>
            </div>
      
    </>
  );
}
export default Admin_login
*/}