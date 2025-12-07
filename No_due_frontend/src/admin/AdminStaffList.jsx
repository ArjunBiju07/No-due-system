import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import "../Designs/admin/CreateId.css";
import { toast } from "react-toastify";
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
   const handleDelete = (ida) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    fetch("http://localhost:3000/Staff/Delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: ida }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);

          // ✅ Remove user instantly from UI
         setName((prev) => prev.filter((user) => user.id !== ida));

        } else {
          toast.error("Delete failed. Please try again");
        }
      })
      .catch((error) => {
        console.log("Delete error", error);
        toast.error("Server error while deleting");
      });
  };
  return (
    <div>
        <Header />
          <div className="home">
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
                <td>
                   <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
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
    </div>
  )
}

export default StaffList
