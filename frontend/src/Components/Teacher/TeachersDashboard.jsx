import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'; // Your existing sidebar component
import { useNavigate } from "react-router-dom"; // Import the hook for navigation

const TeacherDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate(); // Initialize navigate hook
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);


   // Function to handle avatar click and navigate to student profile
   const handleAvatarClick = () => {
    navigate('/teacherProfile'); // Replace with your profile route
  };
  // Sample data
  const classes = [
    { id: 1, name: 'Mathematics', time: '9:00 AM', students: 24, room: 'B-204' },
    { id: 2, name: 'Physics', time: '11:30 AM', students: 18, room: 'A-103' },
  ];

  const announcements = [
    { id: 1, date: '15 Mar', title: 'Staff Meeting', content: 'Mandatory meeting at 3 PM in the conference room' },
    { id: 2, date: '17 Mar', title: 'Exam Papers', content: 'Submit final exam papers by Friday' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Your existing sidebar */}
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto ml-[270px]" style={{ backgroundColor: "#eff2f4" }}>
        {/* Top Navigation */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' && 'Teacher Dashboard'}
              {activeTab === 'classes' && 'My Classes'}
              {activeTab === 'students' && 'Student Management'}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative cursor-pointer">
                <svg className="w-6 h-6 text-gray-500 hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">{user?.name || 'Teacher'}</span>
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
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Card */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name || 'Professor'}!</h2>
                    <p className="text-gray-600 mt-1">You have {classes.length} classes scheduled today</p>
                  </div>
                  <div className="text-blue-600">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium">Total Classes</h3>
                      <p className="text-3xl font-bold text-gray-800 mt-2">5</p>
                    </div>
                    <div className="text-blue-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium">Students</h3>
                      <p className="text-3xl font-bold text-gray-800 mt-2">142</p>
                    </div>
                    <div className="text-green-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium">Pending Grading</h3>
                      <p className="text-3xl font-bold text-gray-800 mt-2">23</p>
                    </div>
                    <div className="text-yellow-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Today's Schedule</h2>
                  <span className="text-sm text-blue-600 font-medium">View All</span>
                </div>
                <div className="divide-y divide-gray-200">
                  {classes.map(cls => (
                    <div key={cls.id} className="p-6 hover:bg-blue-100 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">{cls.name}</h3>
                          <div className="flex space-x-4 mt-1">
                            <span className="text-sm text-gray-500 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {cls.time}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {cls.students} students
                            </span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {cls.room}
                            </span>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                          View Class
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcements */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Announcements</h2>
                  <span className="text-sm text-blue-600 font-medium">View All</span>
                </div>
                <div className="divide-y divide-gray-200">
                  {announcements.map(announcement => (
                    <div key={announcement.id} className="p-3 hover:bg-blue-100 transition-colors">
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {announcement.date}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'classes' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">My Classes</h2>
              {/* Class content would go here */}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Student Management</h2>
              {/* Student management content would go here */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;