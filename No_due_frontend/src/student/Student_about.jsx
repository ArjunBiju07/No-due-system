import React from 'react'
import Student_header from './Student_header'

function Student_about() {
    return (
        <div className="layout">
            {/* <Sidebar /> */}

            <div className="main-area">
                <Student_header />

                <div className="main-content">
                    <h1>About</h1>
                </div>
            </div>
        </div>
    )
}

export default Student_about
