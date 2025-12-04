import React from 'react'
import Student_header from './Student_header'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Student_dashboard() {
    const navigate  = useNavigate();
    const Apply = ()=>{
        navigate("/")
    }
  return (
   <div className="layout">
            {/* <Sidebar /> */}

            <div className="main-area">
                <Student_header />

                <div className="main-content">
                        <center>

                    <h1> Student Dashboard</h1>
                    <table>
                        <tr>
                            <td><button
                                onClick={Apply}
                            >

                                Apply for no due</button>
                                </td>

                            <td><button>Check your no due status</button></td>

                        </tr>
                    </table>
                        </center>
                </div>
            </div>
        </div>
  )
}

export default Student_dashboard
