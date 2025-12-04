// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import Header from '../Header';

// function Student_login() {
//   const [adno, setAdno] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     fetch('http://localhost:3000/login', {
//       method: "POST",
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ adno, password }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           alert("Login sucess");
//           navigate('/');
//         }
//         else {
//           alert(data.message || 'Invalid username or password')
//         }
//       })
//       .catch((err) => {
//         console.error("Login error", err);
//         alert("Login failed");
//       })
//   }
//   return (
//     <div className="layout">
//       {/* <Sidebar /> */}

//       <div className="main-area">
//         <Header />

//         <div className="main-content">
//           <div className="container mt-5">
//             <div className="row justify-content-center">
//               <div className="col-md-4">
//                 <div className="card shadow-lg">
//                   <div className="card-body">
//                     <h3 className="text-center mb-4">Student Login</h3>

//                     <form onSubmit={handleLogin}>
//                       <div className="mb-3">
//                         <label className="form-label">Admission Number</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           placeholder="Enter Register Number"
//                           value={adno}
//                           onChange={(e)=>setAdno(e.target.value)}
//                         />
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label">Password</label>
//                         <input
//                           type="password"
//                           className="form-control"
//                           placeholder="Enter Password"
//                           value={password}
//                           onChange={(e)=>setPassword(e.target.value)}
//                         />
//                       </div>

//                       <button
//                         type="submit"
//                         className="btn btn-primary w-100"
//                       >
//                         Login
//                       </button>
//                     </form>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>

//   )
// }

// export default Student_login


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

function Student_login() {
  const [adno, setAdno] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();   // FIXED

    fetch("http://localhost:3000/login", {  // FIXED URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adno, password })
    })
      .then((response) => response.json())
      .then((data) => {

        if (data.message === "Login successful") {   // FIXED CONDITION
          alert("Login success");
          navigate("/");  // redirect
        } else {
          alert(data.message || "Invalid Admission No or Password");
        }
      })
      .catch((err) => {
        console.error("Login error", err);
        alert("Login failed");
      });
  };

  return (
    <div className="layout">
      <div className="main-area">
        <Header />

        <div className="main-content">
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="card shadow-lg">
                  <div className="card-body">
                    <h3 className="text-center mb-4">Student Login</h3>

                    <form onSubmit={handleLogin}>
                      <div className="mb-3">
                        <label className="form-label">Admission Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Admission Number"
                          value={adno}
                          onChange={(e) => setAdno(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                      >
                        Login
                      </button>

                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Student_login;
