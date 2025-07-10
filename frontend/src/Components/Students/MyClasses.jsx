import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, Lock, CheckCircle, Search } from 'react-feather';
import Navbar from './Navbar';
import axios from 'axios';

const MyClasses = () => {
  // State declarations
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState(null); // Replace with actual user name

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUserName(JSON.parse(userData));
    }
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const loadClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Classes');
      // Transform the data to include static fields
      const transformedClasses = response.data.map(cls => ({
        ...cls,
        teacher: {
          name: cls.teacherName,
          photo: 'https://randomuser.me/api/portraits/women/44.jpg', // Static photo
          department: 'Mathematics' // Static department
        },
        isPaid: true, // Static isPaid
        paymentStatus: 'completed', // Static paymentStatus
        startTime: cls.schedule.split(' ')[1], // Extract time from schedule
        endTime: cls.schedule.split(' ')[1], // You might want to calculate this based on duration
        date: cls.schedule.split(' ')[0], // Extract date from schedule
        duration: `${cls.duration} mins`,
        joinLink: '#',
        name: cls.className,
        subject: cls.subject,
        description: cls.description || 'No description available'
      }));
      setClasses(transformedClasses);
      if (transformedClasses.length > 0) {
        setSelectedClass(transformedClasses[0]);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  // Check if class is currently active
  const isClassActive = (cls) => {
    const classDate = new Date(cls.date);
    const today = new Date();
    if (classDate.toDateString() !== today.toDateString()) return false;
    
    const [startHour, startMinute] = cls.startTime.split(':').map(Number);
    const [endHour, endMinute] = cls.endTime.split(':').map(Number);
    
    const classStart = new Date();
    classStart.setHours(startHour, startMinute, 0, 0);
    
    const classEnd = new Date();
    classEnd.setHours(endHour, endMinute, 0, 0);
    
    return currentTime >= classStart && currentTime <= classEnd;
  };

  // Check if meeting has started
  const hasMeetingStarted = (cls) => {
    if (!cls.room) return false;
    return true;
  };

  // Filter classes
  const filteredClasses = classes.filter(cls => {
    const paymentMatch = filter === 'all' || 
                        (filter === 'paid' && cls.isPaid) || 
                        (filter === 'unpaid' && !cls.isPaid);
    const searchMatch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       cls.teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return paymentMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 ">
      <Navbar />
      <div className="max-w-7xl ml-[250px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-70px)]">
          {/* Class List */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search classes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                {filteredClasses.map((cls) => (
                  <div
                    key={cls._id}
                    onClick={() => setSelectedClass(cls)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      selectedClass?._id === cls._id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-blue-100 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800 text-sm">{cls.name}</h3>
                        <p className="text-gray-500 text-xs mt-1">{cls.subject}</p>
                      </div>
                      {cls.isPaid ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{cls.schedule}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Class Details */}
          {selectedClass && (
            <div className="w-full md:w-2/3 h-full">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{selectedClass.name}</h2>
                      <p className="text-gray-600 mt-1">{selectedClass.subject}</p>
                    </div>
                    <div className="flex items-center">
                      <img
                        src={selectedClass.teacher.photo}
                        alt={selectedClass.teacher.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{selectedClass.teacher.name}</p>
                        <p className="text-xs text-gray-500">{selectedClass.teacher.department}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Schedule</p>
                      <p className="text-sm font-medium text-gray-800 mt-1">{selectedClass.schedule}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="text-sm font-medium text-gray-800 mt-1">{selectedClass.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Room</p>
                      <p className="text-sm font-medium text-gray-800 mt-1">{selectedClass.room || 'Not started'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <p className="text-sm font-medium text-gray-800 mt-1">{selectedClass.paymentStatus}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-sm text-gray-800 mt-1">{selectedClass.description}</p>
                  </div>

                  <div className="mt-6">
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="mb-2 sm:mb-0">
                          <h3 className="font-medium text-gray-800 text-sm mb-0.5">Meeting Status</h3>
                          <p className="text-blue-600 text-xs">
                            {hasMeetingStarted(selectedClass) 
                              ? `Meeting ID: ${selectedClass.room}`
                              : 'Meeting not started yet'}
                          </p>
                        </div>
                        {selectedClass.isPaid ? (
                            hasMeetingStarted(selectedClass) ? (
                              <Link 
                                to={`/VideoPlatform?userName=${encodeURIComponent(userName?.username)}&meetingId=${selectedClass.room}&isMeetingCreater=${false}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-4 rounded-md transition w-full sm:w-auto text-center"
                              >
                                Join Meeting
                              </Link>
                            ) : (
                              <button
                                disabled
                                className="bg-gray-300 text-gray-600 text-xs font-medium py-2 px-4 rounded-md transition w-full sm:w-auto text-center cursor-not-allowed"
                              >
                                Meeting Not Started
                              </button>
                            )
                          
                        ) : (
                          <button
                            disabled
                            className="bg-gray-300 text-gray-600 text-xs font-medium py-2 px-4 rounded-md transition w-full sm:w-auto text-center cursor-not-allowed"
                          >
                            Payment Required
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyClasses;