import React from 'react';
import Header from '../Header'; 
import { Link } from "react-router-dom";
import '../Designs/admin/AdminHome.css'; 

function AdminHome() {
  return (
    <>
      <Header />
      
      <div className="home">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1>Welcome Admin</h1>
            <p>Here you can manage all the admin functionalities.</p>
          </div>
        </div>

        <div className="Direction">
            {/* The span element for the section title (uses grid-column: 1 / -1 in CSS) */}
            <span className="Description">Main Settings</span>

            {/* Note: I've added the class "a" to Link components to match the CSS nth-of-type selectors */}
            <Link to="/admin/Staff" className="a design"><h1>Create ID</h1></Link>
            <Link to="/admin/Duties" className="a design"><h1>ADD Duties</h1></Link>
            <Link to="/admin/Department" className="a design"><h1>ADD Department</h1></Link>
            <Link to="/admin/AssignDuties" className="a design"><h1>Assign Duties</h1></Link>

            <span className="Description">General Management</span>

            <Link to="/admin/Reports" className="a design"><h1>View Reports</h1></Link>
            <Link to="/admin/Users" className="a design"><h1>Manage Users</h1></Link>
            <Link to="/admin/Configuration" className="a design"><h1>System Config</h1></Link>
        </div>
      </div>
      
      
      
    </>
  )
}

export default AdminHome;