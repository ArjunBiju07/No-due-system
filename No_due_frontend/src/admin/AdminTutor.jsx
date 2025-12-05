import React from 'react'
import Header from '../Header';
import { Link } from 'react-router-dom'
import '../Designs/admin/CreateId.css'

function AdminTutor() {
  return (
    <>
       <Header />

    <div className="add-tutor-card">
        <div className="card-title">Add Tutor</div>

        <div className="input-group">
            <div className="input-box">
                <input type="text" placeholder=" " />
                <label>Tutor Name</label>
            </div>

            <div className="input-box">
                <input type="text" placeholder=" " />
                <label>Username</label>
            </div>
        </div>

        <div className="button-box">
            <button type="submit">ADD</button>
            <button type='reset'>Clear</button>
        </div>
        
    </div>

    
    <div className="table-container">
        <h2 style={{ marginBottom: "10px", fontSize: "20px", textAlign: "center",
         }}>
            TUTOR LIST
</h2>

        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>

    <div className="Back">
       <Link to="/admin/Home" className="Back"><ion-icon name="home"></ion-icon> </Link>
        
    </div>
    </>
  )
}

export default AdminTutor
