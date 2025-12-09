import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../Header";
import "../../Designs/admin/CreateId.css";
import { toast } from "react-toastify";

function Year() {
    const [viewYear , setYear]=useState([]);

    useEffect(()=>{
        fetch("http://localhost:3000/Year/List")
        .then((response)=>response.json())
        .then((result)=> setYear(result))
         .catch((error) => {
        console.log("Error feacthing", error)
      })
    },[])
const handleDelete=(ids)=>{
    const ConfirmDelete= window.confirm("Are you sure you want to delete this Duty?");
     if (!ConfirmDelete) return;

     fetch("http://localhost:3000/Year/Delete",{
        method: "POST",
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({id : ids}),
     })
     .then((response)=>response.json())
     .then((data)=>{
       if(data.success){
        toast.success(data.message)
        setYear((prev) => prev.filter((acYear) => acYear.id !== ids));
       } else{
        toast.error("Delete failed. Please try again")
       }
     })
     .catch((error) => {
             console.log("Delete error", error);
             toast.error("Server error while deleting");
           });
}
  return (
    <div>
        <Header />
        <div className="home">
       <div className="table-container">
        <h2 className="table-title">DUTY LIST</h2>

        <table>
          <thead>
            <tr>
              <th>DUTY</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {viewYear.length > 0 ? 
            viewYear.map((acYear)=> (
             <tr key={acYear.id}>
                <td>{acYear.year}</td>
                <td>
                    <button className="delete-btn" onClick={() => handleDelete(acYear.id)}>Delete</button>                   
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

export default Year
