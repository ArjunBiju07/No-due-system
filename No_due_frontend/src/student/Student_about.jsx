import React from 'react'
import Student_header from './Student_header'
import Footer from '../Footer'

function Student_about() {
    return (
        <div className="layout">

            <div className="main-area">
                <Student_header />

                <div className="main-content">
                    <h1>About</h1>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Student_about
