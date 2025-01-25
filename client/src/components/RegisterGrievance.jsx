import React, { useState, useContext } from "react";
import axios from "axios";
import Navbar from "./Navbar"; // Assuming Navbar is available
// import { useAuth } from "../context/AuthContext";

export default function RegisterGrievance() {
  // Access user details from context
  // const {user} = useAuth();

  const [grievanceDetails, setGrievanceDetails] = useState({
    grievanceDescription: "",
    relatedDepartment: "Engineering", // Default department
    supportingDocument: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    
    setGrievanceDetails({
      ...grievanceDetails, [e.target.name]: e.target.value,
    })

    setError(""); 
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    console.log(grievanceDetails);

    // Basic validation
    if (!grievanceDetails.grievanceDescription || !grievanceDetails.relatedDepartment) {
      setError("Please fill in all the fields.");
      return;
    }

    try {
      const payload = {
        // form which will be sent
        grievanceDescription: grievanceDetails.grievanceDescription,
        relatedDepartment: grievanceDetails.relatedDepartment,
        supportingDocument: grievanceDetails.supportingDocument,
      };


      const response = await axios.post(

        `${import.meta.env.VITE_BACKEND}/api/v1/createGrievance`,
        payload,{
          withCredentials: true,
          
        }
      );
      console.log(response);

      if (response.data.success) {
        setSuccessMessage(`Your grievance No.  ${response?.data?.grievanceNumber} has been successfully registered. You will receive Mail for the same. `);
        setGrievanceDetails({
          grievanceDescription: "",
          relatedDepartment: "Engineering",
          supportingDocument: "",
        });
        setError("");
      } else {
        setError(response.data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message ||  `error while fetching the server`  );
    }
  };

  return (
    <div>
    <Navbar />

    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md max-w-full md:mx-24 mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Register a Grievance</h2>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="relatedDepartment" className="text-lg font-semibold mb-2 block">
              Department
            </label>
            <select
              id="relatedDepartment"
              name="relatedDepartment"
              value={grievanceDetails.relatedDepartment}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg outline-none"
            >
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="supportingDocument" className="text-lg font-semibold mb-2 block">
              Supporting Document (URL)
            </label>
            <input
              type="text"
              id="supportingDocument"
              name="supportingDocument"
              value={grievanceDetails.supportingDocument}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg outline-none"
              placeholder="Provide document URL"
            />
          </div>
        </div>

        <label htmlFor="grievanceDescription" className="text-lg font-semibold mb-2 block">
          Grievance Description (Max. 1000 char)
        </label>
        <textarea
          maxLength={1000}
          id="grievanceDescription"
          name="grievanceDescription"
          value={grievanceDetails.grievanceDescription}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg outline-none"
          placeholder="Describe your grievance"
          rows="4"
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Submit Grievance
        </button>
      </form>

      {error && <p className="mt-4 text-red-500 font-semibold text-center">{error}</p>}
      {successMessage && <p className="mt-4 text-green-500 font-semibold text-center">{successMessage}</p>}
    </div>
  </div>
);
}
