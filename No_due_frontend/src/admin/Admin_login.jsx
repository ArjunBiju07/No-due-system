import React from 'react'
import { Link } from 'react-router-dom'
import Header from './Admin_header'
import Footer from '../Footer'

function Admin_login() {
  return (
    <div className="layout">
      <div className="main-area">
        <Header />

        <div className="main-content">
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="card shadow-lg">
                  <div className="card-body">
                    <h3 className="text-center mb-4">Admin Login</h3>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Admin_login


