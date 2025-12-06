import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import "../Designs/admin/CreateId.css";
function StaffList() {
    const [name , setName]=useState([]);
   
    useEffect(()=>{
        fetch('http://localhost:3000/Staff/List')
        .then((response) => response.json())
      .then((results) => setName(results))
      .catch((error) => {
        console.log("Error feacthing", error)
      })
    },[])
  return (
    <div>
        <Header />
       <div className="table-container">
        <h2 className="table-title">STAFF LIST</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {name.length > 0 ? 
            name.map((user)=> (
             <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.duty}</td>
                <td>Buttons</td>
                {/* <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>                   
                    <button className='btn btn-warning btn-sm' onClick={() => handleEdit(user.id)} >Edit</button>
                      </td> */}
             </tr>
            )
        ):(
            <tr>
                  <td colSpan="4" className='text-center text-muted'>
                    no registration Found
                  </td>
                </tr>)
}

          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StaffList
