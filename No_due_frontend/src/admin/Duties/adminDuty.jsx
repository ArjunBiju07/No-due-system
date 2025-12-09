import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../Header";
import "../../Designs/admin/CreateId.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DutyInsert() {
  const [duties, setDuties] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  // Auto-generate 3-year span
  const handleYearChange = (e) => {
    const value = e.target.value;
    if (/^\d{4}$/.test(value)) {
      const start = parseInt(value);
      setAcademicYear(`${start}-${start + 3}`);
    } else {
      setAcademicYear(value);
    }
  };

  // Submit Duty
  const handleDutySubmit = async (e) => {
    e.preventDefault();
    if (!duties.trim()) {
      toast.warning("Please enter a duty");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/Duty/Insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duties }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.err || "Error adding duty");
        return;
      }

      toast.success(data.message);
      setDuties("");
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
    }
  };

  // Submit Academic Year
  const handleYearSubmit = async (e) => {
    e.preventDefault();
    if (!academicYear.trim()) {
      toast.warning("Please enter an academic year");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/Year/Insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: academicYear }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Error adding year");
        return;
      }

      toast.success(data.message);
      setAcademicYear("");
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="add-tutor-card">

        {/* Duty Section */}
        <form onSubmit={handleDutySubmit}>
          <h2 className="card-title">Add DUTY</h2>
          <div className="input-group">
            <div className="input-box">
              <input
                type="text"
                placeholder=" "
                value={duties}
                onChange={(e) => setDuties(e.target.value)}
              />
              <label>DUTY</label>
            </div>
          </div>
          <div className="button-box">
            <button type="submit" className="add-btn">ADD</button>
            <button type="reset" className="clear-btn" onClick={() => setDuties("")}>CLEAR</button>
          </div>
        </form>

        {/* Academic Year Section */}
        <form onSubmit={handleYearSubmit} style={{ marginTop: "40px" }}>
          <h2 className="card-title">Add ACADEMIC YEAR</h2>
          <div className="input-group">
            <div className="input-box">
              <input
                type="text"
                placeholder=""
                value={academicYear}
                onChange={handleYearChange}
              />
              <label>ACADEMIC YEAR</label>
            </div>
          </div>
          <div className="button-box">
            <button type="submit" className="add-btn">ADD</button>
            <button type="reset" className="clear-btn" onClick={() => setAcademicYear("")}>CLEAR</button>
          </div>
        </form>
      </div>

      {/* Navigation */}
      <div className="Direction" style={{ marginTop: "20px" }}>
        <Link to="/Duty/List" className="a design"><h1>DUTY LIST</h1></Link>
        <Link to="/Year/List" className="a design"><h1>YEAR LIST</h1></Link>
      </div>
    </>
  );
}

export default DutyInsert;
