import React from 'react';
import Student_header from './Student_header';
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom';

function Student_status() {

  const navigate = useNavigate();

  const handleSubmit = ()=>{
    alert("Cannot Apply No Due because you have Due");
    return;
  }

  const handlePdf = () => {
      alert("Cannot generate pdf because Tutor didn't approved");
      return;
  }

  return (
    <div className="layout">

      <div className="main-area">
        <Student_header />

        <div className="main-content container py-4">
          <h1 className="text-center mb-4">Status of No Due</h1>

          <div className="card shadow">
            <div className="card-body">

              {/* General Labs */}
              <form onSubmit={handleSubmit}>

                <h4 className="mb-3">General Labs & Facilities</h4>
                <table className="table table-bordered table-striped">
                  <thead className="table-primary">
                    <tr>
                      <th>Facility / Section</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr><td>Engineering Science Lab (Physics)</td><td>Due</td></tr>
                    <tr><td>Engineering Science Lab (Chemistry)</td><td>Due</td></tr>
                    <tr><td>Workshop</td><td>Due</td></tr>
                    <tr><td>Library</td><td>Due</td></tr>
                    <tr><td>Physical Education</td><td>Due</td></tr>
                    <tr><td>National Service Scheme (NSS)</td><td>Due</td></tr>
                    <tr><td>National Cadet Corps (NCC)</td><td>Due</td></tr>
                    <tr><td>Language Lab</td><td>Due</td></tr>
                    <tr><td>Common Computing Facility</td><td>Due</td></tr>
                    <tr><td>Placement Cell</td><td>Due</td></tr>
                    <tr><td>Innovation & Entrepreneurship Development Centre (IEDC)</td><td>Due</td></tr>

                    {/* Computer Labs */}
                    <h4 className="mt-5 mb-3">Computer Labs</h4>

                    <tr><td>Software Lab</td><td>Due</td></tr>
                    <tr><td>Hardware Lab (CT / IF)</td><td>Due</td></tr>


                    {/* Electronics Labs */}
                    <h4 className="mt-5 mb-3">Electronics Labs</h4>

                    <tr><td>Digital Computer Principles Lab (CT)</td><td>Due</td></tr>
                    <tr><td>Digital Computing Lab (IF)</td><td>Due</td></tr>


                    {/* Account Section */}
                    <h4 className="mt-5 mb-3">Account Section</h4>

                    <tr><td>Account Section</td><td>Due</td></tr>

                    <h4 className="mt-5 mb-3">Class Tutor</h4>
                    <tr><td>Tutor</td><td>The Request is not sent to the tutor (Click: Apply No Due)</td></tr>
                  </tbody>
                  <br />
                </table>
                < div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary px-4" onClick={() => navigate(-1)}>Back</button>
                  <button type="submit" className="btn btn-primary px-4">Apply No Due</button>
                  <button type='button' className='btn btn-success px-4' onClick={handlePdf}>Generate PDF</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Student_status;
