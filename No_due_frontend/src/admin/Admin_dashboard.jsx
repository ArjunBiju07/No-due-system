import React from 'react'
import Admin_header from './Admin_header'
import Footer from '../Footer'

function Admin_dashboard() {
  return (
    <>
    <Admin_header />
    <h1>Admin Dashboard</h1>
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Admin Dashboard</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}

export default Admin_dashboard