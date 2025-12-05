import React from 'react'
import Student_header from './Student_header'
import { useNavigate } from 'react-router-dom'

function Student_drop() {

    const navigate = useNavigate();


    return (
        
        <div className="layout">
            <div className="main-area">
                <Student_header />

                <div className="main-content d-flex flex-column justify-content-center align-items-center p-4">

                    {/* Heading */}
                    <h1 className="mb-4 text-center">Course Droping</h1>

                    <form className="w-50 shadow p-4 rounded bg-light">

                        {/* Year of Study */}
                        <div className="mb-3">
                            <label className="form-label">Year of Study</label>
                            <select className="form-select">
                                <option>-- Select --</option>
                                {Array.from({ length: 17 }, (_, i) => 2020 + i).map((year) => (
                                    <option key={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        {/* Semester */}
                        <div className="mb-3">
                            <label className="form-label">Semester</label>
                            <select className="form-select">
                                <option>-- Select --</option>
                                <option>S1</option>
                                <option>S2</option>
                                <option>S3</option>
                                <option>S4</option>
                                <option>S5</option>
                                <option>S6</option>
                            </select>
                        </div>

                        
                        <div className="mb-3">
                            <label className="form-label">Reason for Request</label>
                            <textarea className="form-control" rows="3"></textarea>
                        </div>

                        
                        <div className="d-flex justify-content-between">
                            <button type="button" className="btn btn-secondary px-4" onClick={() => navigate(-1)}>Back</button>
                            <button type="submit" className="btn btn-primary px-4">Confirm</button>
                        </div>

                    </form>

                </div>
            </div>
        </div>

    )
}

export default Student_drop
