import { React, useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext';



const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu
  const menuRef = useRef(null); // Reference for the menu container

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Close the menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {

      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex items-center h-full">
        <button
          onClick={() => navigate("/login")}
          className="hover:cursor-pointer bg-white text-green-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-100 transition duration-300 shadow-md"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex items-center h-full "  ref={menuRef}>
      {/* Fullname Button */}
      <button
        className="hover:cursor-pointer bg-white text-green-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-100 transition duration-300 shadow-md"
        onClick={() => setIsMenuOpen((prev) => !prev)} // Toggle the menu
      >
        {user.fullname}
      </button>

      {/* Logout Menu */}
      {isMenuOpen && (
        <div className="absolute mt-44 right-0 w-48 bg-white px-4 py-2 rounded-md text-sm font-medium shadow-md">
          <div className="flex flex-col space-y-4">
            <button
              className="hover:cursor-pointer text-green-800 transition duration-300 w-full text-left"
              onClick={() => navigate('/grievance')}
            >
              Grievance
            </button>
            <button
              className="hover:cursor-pointer text-green-800 transition duration-300 w-full text-left"
              onClick={() => navigate('/support-chat')}
            >
              Live Support Chat
            </button>
            <button
              className="hover:cursor-pointer text-red-800 transition duration-300 w-full text-left"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      )}

    </div>
  );
};


const MobileMenu = ({setIsMobileMenuOpen})=>{

  const { user, logout } = useAuth();




  return (

    
      <div  className="absolute mt-48 right-0 w-48 bg-white px-4  py-2 rounded-md text-sm font-medium shadow-md  transform  transition-transform duration-300 ease-in-out"
            style={{ transform: 'translateX(0)' }}

      >


        
          <div className="flex flex-col space-y-4 ">
          <p>{user.fullname}</p>

            <button
              className="hover:cursor-pointer text-green-800 transition duration-300 w-full text-left"
              onClick={() => navigate('/grievance')}
            >
              Grievance
            </button>
            <button
              className="hover:cursor-pointer text-green-800 transition duration-300 w-full text-left"
              onClick={() => navigate('/support-chat')}
            >
              Live Support Chat
            </button>
            <button
              className="hover:cursor-pointer text-red-800 transition duration-300 w-full text-left"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
  )
}


export default function Navbar() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState();



  const handleMobileMenu = ()=>{
    console.log("cllicked on mobile menu");

    setIsMobileMenuOpen(!isMobileMenuOpen);


  }

  useEffect(()=>{




  }, []);



  return (
    <div>

      <header className="bg-green-800 shadow-md">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-white"> <a href="/">  Grievance Portal</a></div>
            <div className="hidden md:flex justify-center items-center space-x-4">
              <Link
                to="/check-status"
                className="text-white hover:text-green-200 transition duration-300"
              >
                Check Status
              </Link>
              <Link
                to="/register-grievance"
                className="text-white hover:text-green-200 transition duration-300"
              >
                Register Grievance
              </Link>



              <Profile />

            </div>
            <div className="md:hidden" onClick={()=>handleMobileMenu()} >
              <button className="text-white focus:outline-none   hover:cursor-pointer"  >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            {
            isMobileMenuOpen &&

            <MobileMenu  />

            }
          </div>
        </nav>
      </header>


    </div>
  )
}
