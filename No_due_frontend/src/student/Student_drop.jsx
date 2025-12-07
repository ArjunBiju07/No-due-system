import React, { useState } from 'react'
import Student_header from './Student_header'
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom'

function Student_drop() {

    const navigate = useNavigate();

    const currentYear = new Date().getFullYear();
    const [year] = useState(currentYear);
    const [sem, setSem] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const ok = confirm("Are you sure that the entered items are correct?");
        if(!ok) return;

        fetch("http://localhost:3000/course_drop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ year, sem, reason })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                setSem('');
                setReason('');
                navigate(-1);
            })
            .catch(err => {
                alert("Something went wrong.please try again later".err);
            })
    }

    return (

        <div className="layout">
            <div className="main-area">
                <Student_header />

                <div className="main-content d-flex flex-column justify-content-center align-items-center p-4">

                    {/* Heading */}
                    <h1 className="mb-4 text-center">Course Droping</h1>

                    <form className="w-50 shadow p-4 rounded bg-light" onSubmit={handleSubmit}>

                        {/* Year of Study */}
                        <div className="mb-3">

                            <label className="form-label">Year of Study</label>
                            <input
                                type="text"
                                className="form-control"
                                value={year}
                                readOnly
                            />
                        </div>

                        {/* Semester */}
                        <div className="mb-3">
                            <label className="form-label">Semester</label>
                            <select
                                className="form-select"
                                required
                                value={sem}
                                onChange={(e) => setSem(e.target.value)}
                            >
                                <option>-- Select --</option>
                                <option value={1}>S1</option>
                                <option value={2}>S2</option>
                                <option value={3}>S3</option>
                                <option value={4}>S4</option>
                                <option value={5}>S5</option>
                                <option value={6}>S6</option>
                            </select>
                        </div>


                        <div className="mb-3">
                            <label className="form-label">Reason for Request</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                            </textarea>
                        </div>


                        <div className="d-flex justify-content-between">
                            <button type="button" className="btn btn-secondary px-4" onClick={() => navigate(-1)}>Back</button>
                            <button type="submit" className="btn btn-primary px-4">Submit</button>
                        </div>

                    </form>

                </div>
                <Footer />
            </div>
        </div>

    )
}

export default Student_drop
