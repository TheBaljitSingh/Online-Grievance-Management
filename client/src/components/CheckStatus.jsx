import {React, useEffect, useState} from 'react'
import Navbar from './Navbar'
import axios from 'axios'

export default function CheckStatus() {

  const [grievanceNumber, setGrievanceNumber] = useState("");
  const [grievanceStatus, setGrievanceStatus] = useState("");

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setGrievanceNumber(e.target.value);
    setError("");

  }; 
  
  
  const handleSubmit = async (e)=>{
    e.preventDefault();

    
    
try {
  
      const res = await axios.get(`${import.meta.env.VITE_BACKEND}/api/v1/${grievanceNumber}/status`);
      
      console.log(res);
  
      if(!res.data.success){
        setError(res.data.message);
        setGrievanceStatus("");
        return;
      }
         
      setGrievanceStatus(res.data.status || "Status not available");
      setError("");
      
} catch (error) {
  console.log(error);

  setError("An error occurred while fetching the status. Please try again.");
  setGrievanceStatus(""); // Clear the status if an error occurs
  
}


  }
  

  useEffect(()=>{



  }, [error,grievanceStatus])


  
  
  
  return (
    <div>
      <Navbar/>

      <div className="flex flex-col items-center mt-8 p-6 bg-gray-100 rounded-lg shadow-md max-w-sm mx-auto">

        <form onSubmit={handleSubmit}>

      <label htmlFor="grievanceNumber" className="text-lg font-semibold mb-2">
        Enter Your Grievance Number
      </label>

    <div className='flex space-x-4'>

      <input
        type="text"
        id="grievanceNumber"
        value={grievanceNumber}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg outline-none  "
        placeholder="Enter your Grievance Number"
        />

    <button type='submit' className='hover:cursor-pointer' >check</button>
        </div>

        </form>


        {error && (
          <p className="mt-4 text-red-500 font-semibold">
            {error}
          </p>
        )}

        {
          grievanceStatus && 
          <div >

      <p className="mt-4 text-gray-600">
            <strong>Status:</strong> your Greivance is <span className="text-green-800">{grievanceStatus} </span> 
      </p>
        </div>
        }
    
      </div>
    </div>
  )
}
