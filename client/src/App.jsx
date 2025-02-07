import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import axios from 'axios';
// import MouseMoveEffect from "../src/components/Mouse-move-effect"

import { FaFileAlt, FaSearch, FaComments } from "react-icons/fa";


import Cookies from "js-cookie"


const mousePointer = ()=>{
  const [ position, setPosition] = useState({x:0,y:0});


  const handleMouseMove = (e)=>{
    // position.x=e.clientX;
    // position.y=e.clientY;

    setPosition({x:e.clientX, y:e.clientY});

  }

  useEffect(()=>{

    window.addEventListener("mousemove", handleMouseMove);

    return ()=>{
      window.removeEventListener("mousemove", handleMouseMove);
    }

  });

  return position;
}



function App() {

  const position = mousePointer();

  
  return (
    <>

<div className="relative min-h-screen bg-gray-50 text-gray-900">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] bg-blue-400/20 blur-[80px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-purple-400/20 blur-[80px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Mouse Position Indicator */}
        <p className="fixed top-4 left-4 mt-14 text-balck text-sm px-2 py-1 rounded-md shadow-lg">
          {`x: ${position.x} y: ${position.y}`}
        </p>

        <main className="flex flex-col items-center justify-center px-6 py-16">
          <div className="text-center max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-green-600 mb-4">
              Online Grievance Management
            </h1>
            <p className="text-gray-700 text-lg">
              Efficiently manage and resolve grievances with our online platform.
            </p>
          </div>

          {/* Key Features Section */}
          <section className="mt-16 w-full max-w-5xl px-4">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
  <Link to="/register-grievance" className="p-6 rounded-lg shadow-lg flex flex-col items-center hover:bg-green-100 transition">
    <div className="bg-green-500 p-4 rounded-full mb-4 text-white text-3xl">
      <FaFileAlt />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Register Grievance</h3>
    <p className="text-gray-600 text-sm">Easily file grievances with a user-friendly interface.</p>
  </Link>

  <Link to="/check-status" className="p-6 rounded-lg shadow-lg flex flex-col items-center hover:bg-blue-100 transition">
    <div className="bg-blue-500 p-4 rounded-full mb-4 text-white text-3xl">
      <FaSearch />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Track Grievance</h3>
    <p className="text-gray-600 text-sm">Monitor real-time updates and progress of your complaints.</p>
  </Link>

  <Link to="/support-chat" className="p-6 rounded-lg shadow-lg flex flex-col items-center hover:bg-purple-100 transition">
    <div className="bg-purple-500 p-4 rounded-full mb-4 text-white text-3xl">
      <FaComments />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Chat with Admin</h3>
    <p className="text-gray-600 text-sm">Get instant support and direct communication with the admin.</p>
  </Link>
</div>

          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-400 opacity-80 text-gray-300 text-center py-4 mt-16">
          <p>thebaljitsingh</p>
        </footer>
      </div>
    </div>
    </>
    
  )
}




export default App
