import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import "../Designs/admin/CreateId.css";

function AdminStaff() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [duty, setDuty] = useState([]);

  const handleDutyChange = (value) => {
    if (duty.includes(value)) {
      setDuty(duty.filter((d) => d !== value));
    } else {
      setDuty([...duty, value]);
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent page reload
  console.log({ name, username, duty });

  if (!name || !username || duty.length === 0) {
    alert("Please fill all fields and select at least one duty");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/Staff/Insert", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ name, username, duty }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert("Error: " + errorData.err);
      return;
    }

    const data = await res.json();
    alert(data.message);

    // Clear fields after successful submission
    setName("");
    setUsername("");
    setDuty([]);
  } catch (err) {
    console.error(err);
    alert("An error occurred. Please try again.");
  }
};


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   fetch("http://localhost:3000/Staff/insert", {
  //     method: "POST",
  //     headers: {
  //       "Content-type": "application/json",
  //     },
  //     body: JSON.stringify({ name, username, duty }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       alert(data.message);
  //     })
  //     .catch((err) => {
  //       console.log("Error", err);
  //       alert("An error occurred. Please try again.");
  //     });
  // };
  return (
    <>
      <Header />
      <div className="add-tutor-card">
        <form onSubmit={handleSubmit}>
          <h2 className="card-title">Add Staff</h2>

          <div className="input-group">
            <div className="input-box">
              <input
                type="text"
                placeholder=""
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Staff Name</label>
            </div>

            <div className="input-box">
              <input
                type="text"
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label>Username</label>
            </div>

            <p className="duty-title">Select Duty</p>
            <div className="i-checkbox">
              <div className="check">
                <label>
                  Staff
                  <input
                    type="checkbox"
                    checked={duty.includes("Staff")}
                    onChange={() => handleDutyChange("Staff")}
                  />
                  <span></span>
                </label>
              </div>

              <div className="check">
                <label>
                  Tutor
                  <input
                    type="checkbox"
                    checked={duty.includes("Tutor")}
                    onChange={() => handleDutyChange("Tutor")}
                  />
                  <span></span>
                </label>
              </div>
            </div>
            <div className="button-box">
              <button type="submit" className="add-btn" >
                ADD
              </button>
              <button
                type="reset"
                className="clear-btn"
                onClick={() => {
                  setName("");
                  setUsername("");
                  setDuty([]);
                }}
              >
                CLEAR
              </button>
            </div>
          </div>
        </form>
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
          <tbody></tbody>
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