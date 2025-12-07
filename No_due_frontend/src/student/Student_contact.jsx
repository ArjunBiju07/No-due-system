import React from 'react'
import Student_header from './Student_header'
import Footer from '../Footer'

function Student_contact() {
  return (
    <div className="layout">
            {/* <Sidebar /> */}

            <div className="main-area">
                <Student_header />

                <div className="main-content">
                    <h1>contact</h1>
                </div>
                <Footer />
            </div>
        </div>
  )
}

export default Student_contact
