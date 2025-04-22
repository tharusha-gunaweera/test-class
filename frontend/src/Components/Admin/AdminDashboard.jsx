import React from 'react';
import Navbar from './Navbar';

function AdminDashboard() {
  return (
    <div className="flex">
      <Navbar />
      <div className="ml-64 p-6 min-h-screen bg-gray-100 flex-grow">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard content will go here */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-medium mb-4">Total Users</h2>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-medium mb-4">Active Classes</h2>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
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