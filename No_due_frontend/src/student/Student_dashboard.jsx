import React from "react";
import Student_header from "./Student_header";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";

function Student_dashboard() {
  const navigate = useNavigate();

 const ifDue = ()=>{
    alert("Cannot Apply No Due because you have Due");
    // navigate(0);
  }

  return (
    <div className="layout">
      <div className="main-area">
        <Student_header />

        <div className="container py-4">

          {/* Welcome Section */}
          <div className="mb-4 text-center">
            <h2 className="fw-bold">Welcome, Student</h2>
            <p className="text-muted">
              Admission No:  | Semester: S5
            </p>
          </div>

          {/* Status Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h6>Total Sections</h6>
                  <h3 className="text-primary">14</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h6>Cleared</h6>
                  <h3 className="text-success">6</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h6>Pending</h6>
                  <h3 className="text-warning">4</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h6>Due</h6>
                  <h3 className="text-danger">4</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            <button
              className="btn btn-primary px-4"
              onClick={() => ifDue()}
            >
              Apply No Due
            </button>

            <button
              className="btn btn-warning px-4"
              onClick={() => navigate("/student_drop")}
            >
              Apply Course Drop
            </button>

            <button
              className="btn btn-success px-4"
              onClick={() => navigate("/student_status")}
            >
              View Status
            </button>
          </div>

          {/* No Due Status Table */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <h4 className="mb-3">No Due Status</h4>

              <table className="table table-bordered table-striped">
                <thead className="table-primary">
                  <tr>
                    <th>Section</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Library</td>
                    <td><span className="badge bg-danger">Due</span></td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>Workshop</td>
                    <td><span className="badge bg-success">Approved</span></td>
                    <td>12-02-2026</td>
                  </tr>
                  <tr>
                    <td>Class Tutor</td>
                    <td><span className="badge bg-warning text-dark">Pending</span></td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Approval Summary */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <h4 className="mb-3">Approval Status</h4>

              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
                  Tutor
                  <span className="badge bg-warning text-dark">Pending</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  HOD
                  <span className="badge bg-secondary">Not Sent</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  Office
                  <span className="badge bg-secondary">Not Sent</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Download Section */}
          <div className="text-center mb-4">
            <button className="btn btn-outline-secondary px-5" disabled>
              Download No Due Certificate (PDF)
            </button>
            <p className="text-muted mt-2">
              PDF will be enabled after full approval
            </p>
          </div>

        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Student_dashboard;
