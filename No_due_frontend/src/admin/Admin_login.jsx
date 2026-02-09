import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '../Header'
import Footer from '../Footer';

function Admin_login() {
  const [adno, setAdno] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adno, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(data.message);
          navigate('/Admin_dashboard');
        } else {
          alert(data.message);
        }
      })
      .catch(() => {
        alert('Something went wrong. Please try again');
      });
  };

  return (
    <>
      <Header />

      {/* MAIN CONTENT */}
      <div className="container d-flex justify-content-center">
        <div
          className="card shadow p-4 mt-4"
          style={{ width: '100%', maxWidth: '420px' }}
        >
          <h2 className="text-center mb-3">Admin Login</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Admin ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter admin id"
                value={adno}
                onChange={(e) => setAdno(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-end mb-4">
              <Link to="/admin_forgot_password" className="link-primary text-decoration-none">
                Forgot Password?
              </Link>
            </div>  

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Admin_login;
