import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import axios from 'axios';

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
