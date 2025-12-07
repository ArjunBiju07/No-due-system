import React from 'react'
import Student_header from './Student_header';
import Footer from '../Footer';

function Student_profile() {
  return (
    <div className="layout">
            {/* <Sidebar /> */}

            <div className="main-area">
                <Student_header />

                <div className="main-content">
                    <h1>Profile</h1>
                </div>
                <Footer />
            </div>
        </div>
  )
}

export default Student_profile
