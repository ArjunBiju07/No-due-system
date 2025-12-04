import React from "react";
import Student_header from "./Student_header";
import { useNavigate } from "react-router-dom";

function Student_dashboard() {
  const navigate = useNavigate();

  const Apply = () => {
    navigate("/student_applynodue");
  };

  const Status = () => {
    navigate("/student_status");
  };

  return (
    <div className="layout">
      <div className="main-area">
        <Student_header />

        <div className="main-content d-flex flex-column justify-content-center align-items-center p-4">

          {/* Heading */}
          <h1 className="mb-4 text-center">Student Dashboard</h1>

          {/* Buttons */}
          <div className="d-flex justify-content-center gap-3 flex-wrap mt-3">
            <button className="btn btn-primary btn-lg px-4" onClick={Apply}>
              Apply for No Due
            </button>

            <button className="btn btn-success btn-lg px-4" onClick={Status}>
              Check No Due Status
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Student_dashboard;
