import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext'; // Import your authentication context
import axios from 'axios';
import Navbar from './Navbar';
import { Outlet } from 'react-router';




const GrievanceDescription = () => {
  const { GrievanceNumber } = useParams();
  const [grievanceDetails, setGrievanceDetails] = useState(null);

  useEffect(() => {
    // Fetch grievance details using GrievanceNumber
    const fetchGrievanceDetails = async () => {
      try {
        const response = await fetch(`YOUR_BACKEND_API_URL/${GrievanceNumber}`); // Replace with your API endpoint
        const data = await response.json();
        if (data.success) {
          setGrievanceDetails(data.grievance);
        }
      } catch (error) {
        console.error('Error fetching grievance details:', error);
      }
    };

    fetchGrievanceDetails();
  }, [GrievanceNumber]);

  if (!grievanceDetails) {
    return <p>Loading grievance details...</p>;
  }

  return (
    <div>
      <h2>Grievance Details</h2>
      <p><strong>Grievance Number:</strong> {grievanceDetails.grievanceNumber}</p>
      <p><strong>Description:</strong> {grievanceDetails.grievanceDescription}</p>
      <p><strong>Status:</strong> {grievanceDetails.status}</p>
      <p><strong>Department:</strong> {grievanceDetails.relatedDepartment}</p>
      <p><strong>Supporting Document:</strong> <a href={grievanceDetails.supportingDocument} target="_blank" rel="noopener noreferrer">View Document</a></p>
    </div>
  );
};


const MyGrievance = () => {
  const { user, logout } = useAuth(); // Get the current user and logout function from context
  const [grievances, setGrievances] = useState([]); // State to hold grievances
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(''); // State to handle errors

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND}/api/v1/getAllGrievance`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Send cookies
        });
        console.log(res.data);
        setGrievances(res.data.grievance); // Assuming the response has a "grievances" array
        setLoading(false);
      } catch (err) {
        console.error('Error fetching grievances:', err.message);
        setError('Failed to fetch grievances. Please try again later.');
        setLoading(false);
      }
    };

    fetchGrievances();
  }, []);

  const handleLogout = () => {
    logout(); // Clear user state and redirect to login
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
     

      <Navbar/>

      <main className="flex-grow p-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, {user?.fullname || 'User'}!</h2>
        <p className="text-gray-600 mb-8">
          Below is the list of grievances you have Registered.
        </p>

        {loading ? (
          <p className="text-center text-gray-500">Loading grievances...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : grievances?.length === 0 ? (
          <p className="text-center text-gray-600">No grievances found. Start by submitting one!</p>
        ) : (
          <div className="flex flex-row w-full h-screen">
          {/* Left side: Grievance List */}
          <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Grievances</h2>
            {grievances.length === 0 ? (
              <p className="text-gray-600">No grievances found. Start by submitting one!</p>
            ) : (
              <ul className="space-y-4">
                {grievances.map((grievance) => (
                  <li key={grievance._id} className="bg-white shadow-md rounded p-4 border border-gray-200">
                    <Link
                      to={`/grievance/${grievance.grievanceNumber}`}
                      state={{ grievance }}
                      className="text-green-700 font-bold hover:underline"
                    >
                      {grievance.grievanceNumber}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
    
          {/* Right side: Outlet */}
          <div className="w-2/3 bg-white p-6 overflow-y-auto">
            <Outlet />
          </div>
        </div>
        )}
      </main>

      <footer className="bg-black text-white text-center p-4">
        <p>&copy; {new Date().getFullYear()} Online Grievance Management</p>
      </footer>
    </div>
  );
};

export default MyGrievance;
