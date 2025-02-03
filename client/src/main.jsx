import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx'
import Register from "./components/Register.jsx"
import AuthLayout from './components/AuthLayout.jsx'
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from './context/AuthContext.jsx'
import CheckStatus from './components/CheckStatus.jsx'
import RegisterGrievance from './components/RegisterGrievance.jsx'
import MyGrievance from './components/MyGrievance.jsx'
import GrievanceDescription from './components/GrievanceDescription.jsx'
import ChatUser from './components/ChatUser.jsx'
import ChatAdmin from "./components/ChatAdmin.jsx"

import { useAuth } from "./context/AuthContext.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import AdminDashboard from "./components/AdminDashboard.jsx"


const SupportChat = ()=>{
  const {user} = useAuth();

  if (user?.role === 'admin') {
    return <ChatAdmin />;
  } else if (user?.role==='user') {
    return <ChatUser />;
  } else {
    return <div>Please log in to access support chat.</div>;
  }

}


createRoot(document.getElementById('root')).render(

  <GoogleOAuthProvider clientId="491540068639-p971i6u3810kv90tn8ut3hgob21d20ju.apps.googleusercontent.com">

    <AuthProvider>

    <BrowserRouter>
    <Routes>


      <Route path='/' element={<App/>} />

      <Route element={<AuthLayout />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />



    </Route>

      <Route path='/check-status' element={<CheckStatus/>} />
      <Route path='/register-grievance' element={<RegisterGrievance/>} />
      <Route path='/support-chat'  element={<SupportChat/>} />

      <Route path='/grievance' element={ <MyGrievance/>} >

        <Route path=':GrievanceNumber' element={<GrievanceDescription/>} />
      
      </Route>


    </Routes>
    </BrowserRouter>
    </AuthProvider>
    </GoogleOAuthProvider>

  
)
