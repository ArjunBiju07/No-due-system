import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../Header";
import "../../Designs/admin/CreateId.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DutyInsert() {
  const [duties, setDuties] = useState("");
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!duties.trim()) {
     toast.warning("Please enter a duty");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/Duty/Insert", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ duties }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error("Error: " + data.err);
      return;
    }

    toast.success(data.message);
    setDuties("");
  } catch (err) {
    console.error(err);
    toast.error("Server error. Please try again.");
  }
};
  return (
    <>
      <Header />
      <div className="add-tutor-card">
        <form onSubmit={handleSubmit}>
          <h2 className="card-title">Add DUTY</h2>
          <div className="input-group">
            <div className="input-box">
              <input
                type="text"
                placeholder=" "
                value={duties}
                onChange={(e) => setDuties(e.target.value)}
              />
              <label>DUTIES</label>
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
                  setDuties("");
                }}
              >
                CLEAR
              </button>
            </div>
        </form>
      </div>
<div className="Direction">
        
        <Link to="/Duty/List" className="a design">
         <h1>DUTY LIST</h1>
        </Link>
      </div>
    </>
  );
}

export default  DutyInsert;