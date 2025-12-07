import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../Header";
import "../../Designs/admin/CreateId.css";
import { toast } from "react-toastify";

function Dutie_view() {
    const [viewDuty , setDuty]=useState([]);

    useEffect(()=>{
        fetch("http://localhost:3000/Duty/List")
        .then((response)=>response.json())
        .then((result)=> setDuty(result))
         .catch((error) => {
        console.log("Error feacthing", error)
      })
    },[])
const handleDelete=(ids)=>{
    const ConfirmDelete= window.confirm("Are you sure you want to delete this Duty?");
     if (!ConfirmDelete) return;

     fetch("http://localhost:3000/Duty/Delete",{
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
        setDuty((prev) => prev.filter((Duty) => Duty.id !== ids));
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
            <div>
        <Header />
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
            {viewDuty.length > 0 ? 
            viewDuty.map((Duty)=> (
             <tr key={Duty.id}>
                <td>{Duty.duty}</td>
                <td>
                    <button className="delete-btn" onClick={() => handleDelete(Duty.id)}>Delete</button>                   
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

export default Dutie_view
