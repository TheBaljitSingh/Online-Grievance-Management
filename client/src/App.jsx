import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import axios from 'axios';

import { FaFileAlt, FaSearch, FaComments } from "react-icons/fa";


import Cookies from "js-cookie"


// custom hooks for mouse pointer
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

/*
// just for learning purpose created custom hooks:


const useIsOnline = ()=>{

  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  // onlline

  useEffect(()=>{
    window.addEventListener("online", ()=>{
      setIsOnline(true);
    })
    window.addEventListener("offline", ()=>{
      setIsOnline(false);
    })

  }, [])

 return isOnline;

}




function useDebounce  (inputValue, timer){

  const [deboundeValue, setDebounceValue] = useState(inputValue);

    useEffect(()=>{
    let timeoutNumber = setTimeout(()=>{

      setDebounceValue(inputValue);

    },timer)

    return ()=>{
      
      clearTimeout(timeoutNumber);
    }


  }, [inputValue])



  return deboundeValue;

}



*/

function App() {

  const position = mousePointer();


  /*
  // just for learning purpose inporting custom hooks
  
  const [inputValue, setInputValue] = useState();
  
  const debounceValue = useDebounce(inputValue, 300);
  
  useEffect(()=>{
    
    // now here fetch with the debounce value if changed
    
  },[debounceValue])
  
  
  */
  // now here you have to access the debounce valule
  
  return (
    <>

<p className='absolute bg-white mt-17 p-1 rounded-md'>

  {`x: ${position.x} y: ${position.y}`}
</p>



   

    <div className='min-h-screen flex flex-col '>




<Navbar/>



<main className="flex h-full flex-grow flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="h-screen flex flex-col justify-center items-center text-center mb-24">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-800 mb-4">
        <span className="block">Online Grievance</span>
        <span className="block">Management</span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Efficiently manage and resolve grievances with our state-of-the-art online platform. Experience swift
        resolutions and transparent communication.
      </p>
    </div>

    <div className="h-screen w-full bg-gray-100 py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Key Features</h2>
        <p className="text-gray-600 text-lg mb-12">Enhance your experience with our advanced grievance management features.</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="bg-green-500 p-4 rounded-full mb-4 text-white text-3xl">
              <FaFileAlt />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Register Grievance</h3>
            <p className="text-gray-600 text-sm">Easily file grievances with a user-friendly interface.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="bg-blue-500 p-4 rounded-full mb-4 text-white text-3xl">
              <FaSearch />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Track Grievance</h3>
            <p className="text-gray-600 text-sm">Monitor real-time updates and progress of your complaints.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="bg-purple-500 p-4 rounded-full mb-4 text-white text-3xl">
              <FaComments />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chat with Admin</h3>
            <p className="text-gray-600 text-sm">Get instant support and direct communication with the admin.</p>
          </div>
        </div>
      </div>
    </div>
  </main>

    



      <footer className="bg-gray-700 text-white">
        <div className='flex item-center justify-center'>
          {/* <p>hel</p> */}
        thebaljitsingh
        </div>
       
      </footer>
                  </div>
    </>
  )
}




export default App
