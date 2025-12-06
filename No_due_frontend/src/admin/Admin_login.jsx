import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../Header';
import "../Designs/admin/adminlogin.css";

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

            {/* <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div> */}

            <button type="submit">Login</button>

          </div>
          <div>

           
          </div>
        </form>
        </div>
      </section>
    </>
  );
}
export default Admin_login
