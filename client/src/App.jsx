import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import axios from 'axios';

import Cookies from "js-cookie"



function App() {
  // const {user, logout, login} = useAuth();

  // useEffect(() => {
    
  // }, [login, logout]);

  


  console.log(import.meta.env.VITE_BACKEND);

  return (
    <>
  


    <div className='min-h-screen flex flex-col bg-white'>


<Navbar/>

    <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-24">
          <h1 className="text-4xl sm:text-5xl  md:text-6xl font-bold text-green-800 mb-4">
            <span className="block">Online Grievance</span>
            <span className="block">Management</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Efficiently manage and resolve grievances with our state-of-the-art online platform. Experience swift
            resolutions and transparent communication.
          </p>
        </div>

      </main>

      <footer className="bg-gray-700 text-white">
        <div className='flex item-center justify-center'>
          {/* <p>hel</p> */}
        made with ❤️by @thebaljitsingh
        </div>
       
      </footer>
                  </div>
    </>
  )
}




export default App
