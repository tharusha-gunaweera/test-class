import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Lottie from "lottie-react";
import welcomeAnimation from "../Animations/welcome-animation.json"; 
import { useNavigate } from "react-router-dom"; // Import the hook for navigation

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Function to handle avatar click and navigate to student profile
  const handleAvatarClick = () => {
    navigate('/studentProfile'); // Replace with your profile route
  };

  return (
    <div className="flex h-screen w-full">
      <Navbar />
      <div 
        className="flex-1 p-4 font-sans ml-[270px] pl-[50px]"
        style={{ backgroundColor: "#eff2f4" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 shadow-sm rounded-md">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Royal Academy Logo" className="h-10" />
            <div className="text-blue-800 font-bold text-xl">GATHIKA ACADEMY</div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Hello ,</span>
            <span className="text-blue-600 font-semibold">{user?.username || 'Student'}</span>
            {/* Clickable avatar */}
            <img 
              src="/avatar.png" 
              alt="User Avatar" 
              className="h-8 w-8 rounded-full cursor-pointer" 
              onClick={handleAvatarClick} // Add the click handler
            />
          </div>
        </div>

        {/* Welcome Banner with Lottie Animation */}
        <div className="bg-blue-100 p-6 pr-[50px] mt-6 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">March 14, 2024</div>
            <div className="text-2xl font-bold mt-2">Welcome back, {user?.username || 'Student'}!</div>
          </div>
          <div className="w-40 h-40"> {/* Adjust size as needed */}
            <Lottie 
              animationData={welcomeAnimation}
              loop={true}
              autoplay={true}
              style={{ height: 150, width: 150 }}
            />
          </div>
        </div>

        {/* Notice Section */}
        <div className="bg-white p-6 mt-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Notice and Messages</h2>

          {/* Notice Item */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="text-sm font-semibold text-gray-700">14 ,March</div>
            <div className="font-bold text-gray-900 mt-1">Time Table Update</div>
            <p className="text-gray-600 mt-1 text-sm">
              Dear Students, Please be informed that there has been a slight adjustment to the timetable for the upcoming week. Kindly check the updated schedules!
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-700">16 ,March</div>
            <div className="font-bold text-gray-900 mt-1">Time Table Update</div>
            <p className="text-gray-600 mt-1 text-sm">
              Dear Students, Please be informed that there has been a slight adjustment to the timetable for the upcoming week. Kindly check the updated schedules!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
