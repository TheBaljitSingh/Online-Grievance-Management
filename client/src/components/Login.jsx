import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = ({ user, setUser }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/v1/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      Cookies.set("token", response.data.token, {
        expires: 2,
        secure: true,
        sameSite: "Strict",
      });
      login(response.data?.user);
      navigate("/");
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <div>

      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

  


      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your email"
            />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your password"
            />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
          Login
        </button>
       
      </form>
      <p className="mt-4 text-sm text-center text-gray-500">
        Don't have an account? <a href="/register" className="text-indigo-600 font-medium">Register here</a>.
      </p>
      
    </div>
      <div className="flex justify-center items-center my-2">OR</div>
    <div className="flex justify-center items-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const response = await axios.post(
                  `${import.meta.env.VITE_BACKEND}/api/v1/google-login`,
                  { token: credentialResponse.credential },
                  { withCredentials: true }
                );
                Cookies.set("token", response.data.token, {
                  expires: 2,
                  secure: true,
                  sameSite: "Strict",
                });
                login(response.data.user);
                navigate("/");
              } catch (error) {
                console.error("Google Login Failed:", error.response?.data || error.message);
              }
            }}
            onError={() => {
              console.log("Google Login Failed");
            }}
          />
        </div>
          </div>


    
  );
};

export default Login;
