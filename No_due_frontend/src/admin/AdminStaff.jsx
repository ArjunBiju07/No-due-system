import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from '../Header';
import "../Designs/admin/CreateId.css";   // ✅ Link to separate CSS

function AdminStaff() {
const [name, setName] = useState("");
const [username , setUsername] = useState("");
const [duty , setDuty] = useState("");

const handleDutyChange = (value) =>{
    setDuty(value);
};

// const handleSubmit = async (e) => {
//     e.preventDefault();
// }

// last step i created handle submit
  return (
    <>
    <Header />
      <div className="add-tutor-card">
        <h2 className="card-title">Add Staff</h2>

        <div className="input-group">
          <div className="input-box">
            <input type="text" 
            placeholder="" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
            <label>Staff Name</label>
          </div>

          <div className="input-box">
            <input type="text" 
            placeholder=" " 
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            />
            <label>Username</label>
          </div>

          <p className="duty-title">Select Duty</p>
          <div className="i-checkbox">
            <div className="check">
              <label>
                Staff
                <input type="checkbox"
                checked={duty === "Staff"}
                onChange={()=>handleDutyChange("Staff")}
                />
                <span></span>
              </label>
            </div>

            <div className="check">
              <label>
                Tutor
                <input type="checkbox" 
                checked={duty === "Tutor"}
                onChange={()=>handleDutyChange("Tutor")}
                />
                <span></span>
              </label>
            </div>
          </div>
          <div className="button-box">
            <button className="add-btn">ADD</button>
            <button className="clear-btn">CLEAR</button>
          </div>
        </div>
      </div>
      <div className="table-container">
        <h2 className="table-title">STAFF LIST</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
      <div className="Back">
        <Link to="/admin/Home">
          <ion-icon name="home"></ion-icon>
        </Link>
      </div>
    </>
  );
}

export default AdminStaff;
