import React, { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom"; // Import the hook for navigation

function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
  const navigate = useNavigate(); // Hook to programmatically navigate  

  // Function to handle avatar click and navigate to student profile
  const handleAvatarClick = () => {
    navigate('/adminProfile'); // Replace with your profile route
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-64 p-6 min-h-screen bg-gray-100 flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* Header with profile */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            
            <div className="flex items-center space-x-2">

                <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden border border-gray-200">
                  {/* Clickable avatar */}
                <img 
                  src="/avatar.png" 
                  alt="User Avatar" 
                  className="h-8 w-8 rounded-full cursor-pointer" 
                  onClick={handleAvatarClick} // Add the click handler
                />
                </div>
              </div>
          </div>

          {/* Dashboard content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate('/totalUsers')}
        >
              <h2 className="text-lg font-medium mb-4">Total Users</h2>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-medium mb-4">Active Classes</h2>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
             {/* Clickable Total Teachers card */}
            <div
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate('/TeacherManagement')}
       >
              <h2 className="text-lg font-medium mb-4">Total Teachers</h2>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;