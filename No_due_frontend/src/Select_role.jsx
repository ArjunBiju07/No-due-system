import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header';

function Select_role() {
    const navigate = useNavigate();
    return (

        <div className="layout">
            {/* <Sidebar /> */}

            <div className="main-area">
                <Header />

                <div className="main-content d-flex flex-column justify-content-center align-items-center p-4"  >
                    <div>
                        <div className="text-center">
                            <h2 className="fw-bold mb-4">Select Your Role</h2>

                            <div className="d-flex gap-4 justify-content-center">

                                {/* Admin Card */}
                                <div
                                    className="card shadow"
                                    style={{ width: "200px", cursor: "pointer" }}
                                    onClick={() => navigate("/admin_login")}
                                >
                                    <div className="card-body text-center">
                                        <h4 className="fw-bold mb-2">Admin</h4>
                                        <p className="text-secondary small">Login as Administrator</p>
                                    </div>
                                </div>

                                {/* Staff Card */}
                                <div
                                    className="card shadow"
                                    style={{ width: "200px", cursor: "pointer" }}
                                    onClick={() => navigate("/staff_login")}
                                >
                                    <div className="card-body text-center">
                                        <h4 className="fw-bold mb-2">Staff</h4>
                                        <p className="text-secondary small">Login as Staff Member</p>
                                    </div>
                                </div>

                                {/* Student Card */}
                                <div
                                    className="card shadow"
                                    style={{ width: "200px", cursor: "pointer" }}
                                    onClick={() => navigate("/student_login")}
                                >
                                    <div className="card-body text-center">
                                        <h4 className="fw-bold mb-2">Student</h4>
                                        <p className="text-secondary small">Login as Student</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Select_role
