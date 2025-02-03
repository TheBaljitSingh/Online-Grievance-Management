import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';





const GrievanceDescription = () => {

  
  const location = useLocation();

  const grievance = location.state?.grievance;

 





  

  if (!grievance) {
    return <p>No Grievance data found, navigation problem...</p>;
  }

 

  return (
    <div>


      <div
        key={grievance._id}
        className="bg-white shadow-md rounded p-4 border  border-black-200"
      >
        <h2 className='text-xl font-semibold'> {grievance.grievanceNumber} </h2>

        <div className="mt-2 ">
          <h3 className="text-black-400 font-bold">
            Status: <span className='text-lg font-bold text-green-700'>{grievance.status}</span>
          </h3>

          <h3 className="text text-black-400 font-bold ">

            Department: <span className="font-bold text-black-500 text-sm">{grievance.relatedDepartment}</span>

          </h3>



          <p className="text-black-500 text-md">
            <strong>
              Created on: </strong>{new Date(grievance.createdAt).toLocaleDateString()}
          </p>
        </div>
        <p><strong>Supporting Document:</strong> <a href={grievance.supportingDocument} target="_blank" rel="noopener noreferrer" className='hover:cursor-pointer'>View Document</a></p>

        <div className="max-w-full break-words">
          <strong> Grievance Description:</strong> <span className="  ">{grievance.grievanceDescription}</span>


        </div>


      </div>





    </div>
  );
};

export default GrievanceDescription;
