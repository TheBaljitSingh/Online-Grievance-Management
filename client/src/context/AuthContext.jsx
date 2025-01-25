import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();




export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User state
    const [loading, setLoading] = useState(true);



    useEffect(()=>{
        const verifyToken = async () => {
              try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND}/api/v1/verifyToken`, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  withCredentials: true, // Include cookies
                });
        
                if (res.data.success) {
                  setUser(res.data.user); // Store user data in context
                } else {
                    setUser(null);
                  // logout(); // Clear user state on failure
                }
              } catch (error) {
                console.error('Error verifying token:', error.message);
                logout(); // Handle token errors
              } finally{
                setLoading(false);
              }
            };
        
            verifyToken(); // Call the function
    },[])
    

    // Update user state on login
    const login = (userData) => {
        setUser(userData);
    };

    // Clear user state on logout
    const logout = () => {
        setUser(null);
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
