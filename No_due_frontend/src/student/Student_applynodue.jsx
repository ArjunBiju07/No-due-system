// import React from 'react'
// import Student_header from './Student_header'
// import { useNavigate } from 'react-router-dom'
// import Footer from '../Footer';

// function Student_applynodue() {
  
//   const navigate = useNavigate();

//   return (
//     <>
//     <div className="layout">
//       {/* <Sidebar /> */}

//       <div className="main-area">
//         <Student_header />

//         <div className="main-content d-flex flex-column justify-content-center align-items-center p-4">

//           {/* Heading */}
//           <h1 className="mb-4 text-center">Apply NO DUE</h1>

//           {/* Buttons */}
//           <div className="d-flex justify-content-center gap-3 flex-wrap mt-3">
//             <button className="btn btn-success btn-lg px-4" onClick={()=>navigate('/student_complete')}>
//               Course Completed
//             </button>

//             <button className="btn btn-danger btn-lg px-4" onClick={()=>navigate('/student_drop')} >
//               Course Droping
//             </button>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     </div>
//         </>
//   )
// }

// export default Student_applynodue


import React from 'react'
import Student_header from './Student_header'
import { useNavigate } from 'react-router-dom'
import Footer from '../Footer';

function Student_applynodue() {

  const navigate = useNavigate();

  return (
    <div className="d-flex min-vh-100">
      <div className="d-flex flex-column flex-fill">

        <Student_header />

        {/* Main content grows and pushes footer down */}
        <div className="fill d-flex flex-column justify-content-center align-items-center p-4">

          <h1 className="mb-4 text-center">APPLY NO DUE</h1>

          <div className="d-flex justify-content-center gap-3 flex-wrap mt-3">
            <button
              className="btn btn-success btn-lg px-4"
              onClick={() => navigate('/student_complete')}
            >
              Course Completed
            </button>

            <button
              className="btn btn-danger btn-lg px-4"
              onClick={() => navigate('/student_drop')}
            >
              Course Dropping
            </button>
          </div>

        </div>

        {/* Footer stays at bottom */}
        <Footer />

      </div>
    </div>
  )
}

export default Student_applynodue
