import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams   } from 'react-router-dom';
import { Clock, Lock, CheckCircle, Search } from 'react-feather';
import Navbar from './Navbar'

const MyClasses = () => {
  // Sample data with payment status
  const classes = [
    {
      id: 1,
      name: 'Linear Algebra Basics',
      date: '2023-06-15',
      time: '10:00 AM',
      duration: '90 mins',
      joinLink: '#',
      teacher: {
        name: 'Dr. Sarah Johnson',
        photo: 'https://randomuser.me/api/portraits/women/44.jpg',
        department: 'Mathematics'
      },
      subject: 'Advanced Mathematics',
      description: 'Introduction to vectors, matrices, and basic operations in linear algebra.',
      isPaid: true,
      paymentStatus: 'completed',
      startTime: '10:00',
      endTime: '11:30'
    },
    {
      id: 2,
      name: 'React Fundamentals',
      date: '2023-06-16',
      time: '09:00 AM',
      duration: '120 mins',
      joinLink: '#',
      teacher: {
        name: 'Prof. Michael Chen',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        department: 'Computer Science'
      },
      subject: 'Web Development',
      description: 'Learn React core concepts including components, state, and props.',
      isPaid: false,
      paymentStatus: 'pending',
      startTime: '09:00',
      endTime: '11:00'
    },
    {
      id: 3,
      name: 'World History: 20th Century',
      date: '2023-06-17',
      time: '01:00 PM',
      duration: '60 mins',
      joinLink: '#',
      teacher: {
        name: 'Dr. Emma Wilson',
        photo: 'https://randomuser.me/api/portraits/women/68.jpg',
        department: 'History'
      },
      subject: 'Modern History',
      description: 'Examining key events and movements that shaped the modern world.',
      isPaid: true,
      paymentStatus: 'completed',
      startTime: '13:00',
      endTime: '14:00'
    }
  ];

  // State declarations
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [filter, setFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
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
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: "#dcdfe0" }}>
      <Navbar />
      <div className="ml-[300px] p-6" style={{ backgroundColor: "#dcdfe0" }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <h1 className="text-xl font-semibold text-gray-800">My Classes</h1>
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-48">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('paid')}
                className={`px-3 py-1 text-xs rounded-md ${filter === 'paid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Paid
              </button>
              <button
                onClick={() => setFilter('unpaid')}
                className={`px-3 py-1 text-xs rounded-md ${filter === 'unpaid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Unpaid
              </button>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-3 h-[calc(100vh-200px)]">
            {/* Class list */}
            <div className="lg:w-1/3">
              <h2 className="text-sm font-medium mb-2 text-gray-800">
                Upcoming {filteredClasses.length > 0 && `(${filteredClasses.length})`}
              </h2>
              
              {filteredClasses.length === 0 ? (
                <div className="text-center p-3 text-gray-500 text-sm">
                  <Search className="h-5 w-5 mx-auto mb-1" />
                  <p>No classes found</p>
                </div>
              ) : (
                <div className="space-y-2 h-[calc(100vh-250px)] overflow-y-auto pr-1">
                  {filteredClasses.map(cls => (
                    <div 
                      key={cls.id}
                      onClick={() => setSelectedClass(cls)}
                      className={`bg-white p-3 rounded-md border cursor-pointer text-sm ${
                        selectedClass.id === cls.id ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                      } ${!cls.isPaid ? 'opacity-80' : ''}`}
                    >
                      <div className="flex items-center">
                        <img 
                          src={cls.teacher.photo} 
                          alt={cls.teacher.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-800 truncate">{cls.name}</h3>
                            {cls.isPaid ? (
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <Lock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                            <span className="truncate mr-1">{cls.teacher.name}</span>
                            <span className="whitespace-nowrap">{cls.time}</span>
                          </div>
                          {isClassActive(cls) && cls.isPaid && (
                            <div className="flex items-center mt-1 text-xs text-green-600">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>In progress</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Class details */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-md border h-[calc(100vh-200px)] overflow-y-auto">
                {/* Header */}
                <div className="p-4 border-b sticky top-0 bg-white z-10">
                  <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <div>
                      <h1 className="text-lg font-semibold text-gray-800">{selectedClass.name}</h1>
                      <p className="text-xs text-gray-600">{selectedClass.subject}</p>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>{selectedClass.date}</p>
                      <p>{selectedClass.time} • {selectedClass.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Payment status */}
                {selectedClass.isPaid ? (
                  <div className="bg-green-50 p-2 border-b border-green-100 text-xs sticky top-[72px] bg-green-50 z-10">
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>Payment Completed</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-2 border-b border-yellow-100 text-xs sticky top-[72px] bg-yellow-50 z-10">
                    <div className="flex items-center text-yellow-700">
                      <Lock className="w-4 h-4 mr-1" />
                      <span>Payment Required</span>
                    </div>
                  </div>
                )}

                {/* Teacher info */}
                <div className="p-4 border-b">
                  <div className="flex items-center mb-2">
                    <img 
                      src={selectedClass.teacher.photo} 
                      alt={selectedClass.teacher.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">{selectedClass.teacher.name}</h3>
                      <p className="text-gray-600 text-xs">{selectedClass.teacher.department}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-800 text-sm mb-1">Description</h3>
                    <p className="text-gray-600 text-xs">{selectedClass.description}</p>
                  </div>
                </div>

                {/* Join section */}
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="font-medium text-gray-800 text-sm mb-0.5">Meeting Link</h3>
                      <p className="text-blue-600 text-xs">https://meet.example.com/{selectedClass.id}</p>
                    </div>
                    {selectedClass.isPaid && isClassActive(selectedClass) ? (
                      <a 
                        href={selectedClass.joinLink}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-4 rounded-md transition w-full sm:w-auto text-center"
                      >
                        Join Now
                      </a>
                    ) : selectedClass.isPaid ? (
                      <button
                        disabled
                        className="bg-gray-200 text-gray-600 text-xs py-2 px-4 rounded-md w-full sm:w-auto text-center cursor-not-allowed"
                      >
                        {currentTime < new Date(selectedClass.date + 'T' + selectedClass.startTime + ':00') ? 
                          'Not started' : 
                          'Click to join'}
                      </button>
                    ) : (
                      <button
                        onClick={() => alert('Redirect to payment page')}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs py-2 px-4 rounded-md transition w-full sm:w-auto text-center"
                      >
                        Pay to Join
                      </button>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <h3 className="font-medium text-gray-800 text-sm mb-1">Materials</h3>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-gray-600">Lecture Notes</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600">Intro Video</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyClasses;