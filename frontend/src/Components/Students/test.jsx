import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";

function Test() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
    
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    console.log("Raw user data from localStorage:", userData);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
       
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.log("No user data found in localStorage");
      // Optionally redirect to login if no user data
      // navigate('/Login');
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="ml-[400px] mt-10">
        {user ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.username || 'User'}!</h2>
            <Link to="/VideoPlatform" className="font-medium text-indigo-600 hover:text-indigo-500">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Go to Video Platform
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">Please log in to access this feature.</p>
            <Link to="/Login" className="font-medium text-indigo-600 hover:text-indigo-500">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Go to Login
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Test;
