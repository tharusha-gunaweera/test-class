import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import McqSection from'./McqSection';

const ClassManagement = () => {
  // Class Management State
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    teacherID:'',
    teacherName:'',
    className: '',
    subject: '',
    schedule: '',
    duration: '',
    durationHours: '',
    durationMinutes: '',
    room: '',
    description: '',
    mcqs: []
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState('');

  // MCQ Management State
  const [showMCQSection, setShowMCQSection] = useState(false);
  const [currentClassId, setCurrentClassId] = useState(null);
  const [currentClassName, setCurrentClassName] = useState('');
  const [user, setUser] = useState(null);
  
    useEffect(() => {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }, []);


  // Load classes from API
  const loadClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  // Class Management Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      teacherID: user?._id,
      teacherName: user?.username,
      [name]: value
    }));
  };

  const handleDateTimeChange = (e) => {
    setSelectedDateTime(e.target.value);
    if (e.target.value) {
      const date = new Date(e.target.value);
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      const formattedTime = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setFormData(prev => ({
        ...prev,
        schedule: `${formattedDate} ${formattedTime}`
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing class
        const response = await axios.put(`http://localhost:5000/Classes/${editingId}`, formData);
        setClasses(classes.map(cls => 
          cls.id === editingId ? response.data : cls
        ));
        setEditingId(null);
      } else {
        // Add new class
        const response = await axios.post('http://localhost:5000/Classes', formData);
        setClasses([...classes, response.data]);
      }
      
      // Reset form
      setFormData({
        teacherID:'',
        teacherName:'',
        className: '',
        subject: '',
        schedule: '',
        duration: '',
        durationHours: '',
        durationMinutes: '',
        room: '',
        description: '',
        mcqs: []
      });
      setSelectedDateTime('');
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleEdit = (classItem) => {
    const totalMinutes = parseInt(classItem.duration);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    setFormData({
      className: classItem.className,
      subject: classItem.subject,
      schedule: classItem.schedule,
      duration: classItem.duration,
      durationHours: hours.toString(),
      durationMinutes: minutes.toString(),
      room: classItem.room,
      description: classItem.description,
      mcqs: classItem.mcqs || []
    });
    setEditingId(classItem._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await axios.delete(`http://localhost:5000/Classes/${id}`);
        setClasses(classes.filter(cls => cls._id !== id));
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  // MCQ Management Handlers
  const handleAddMCQ = (classId) => {
    const selectedClass = classes.find(cls => cls._id === classId);
    if (selectedClass) {
      setCurrentClassId(classId);
      setCurrentClassName(selectedClass.className);
      setShowMCQSection(true);
    }
  };


  const handleBackToClasses = () => {
    setShowMCQSection(false);
    setCurrentClassId(null);
    setCurrentClassName('');
  };

  // Load classes when component mounts
  useEffect(() => {
    loadClasses();
  }, []);

  // Filtered Data
  const filteredClasses = classes.filter(cls => 
    cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.schedule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-6 px-4">
      <Navbar />
      <div className="ml-[300px] max-w-5xl mx-auto">
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-indigo-700 mb-2">
            {showMCQSection ? `MCQ Questions for ${currentClassName}` : 'Class Management'}
          </h1>
          <p className="text-sm text-indigo-600">
            {showMCQSection ? 'Manage multiple choice questions' : 'Organize your teaching schedule'}
          </p>
        </div>
        
        {showMCQSection ? (
          <McqSection
            classId={currentClassId}
            className={currentClassName}
            onBack={handleBackToClasses}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {/* Add/Edit Class Form */}
            <div className="bg-white p-7 rounded-lg shadow-sm border border-indigo-100">
              <h2 className="text-lg font-semibold mb-5 text-center text-indigo-700">
                {editingId ? 'Edit Class' : 'Add Class'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1.5" htmlFor="className">
                    Class Name
                  </label>
                  <input
                    type="text"
                    id="className"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-sm rounded-md border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    placeholder="e.g., Advanced Math"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1.5" htmlFor="subject">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-sm rounded-md border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    placeholder="e.g., Calculus"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1.5" htmlFor="schedule">
                      Schedule
                    </label>
                    <input
                      type="datetime-local"
                      id="schedule"
                      value={selectedDateTime}
                      onChange={handleDateTimeChange}
                      className="w-full px-4 py-2 text-sm rounded-md border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-1.5" htmlFor="duration">
                      Duration
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <select
                          id="durationHours"
                          name="durationHours"
                          value={formData.durationHours || ''}
                          onChange={(e) => {
                            const hours = e.target.value;
                            const minutes = formData.durationMinutes || '0';
                            const totalMinutes = (parseInt(hours) * 60) + parseInt(minutes);
                            setFormData(prev => ({
                              ...prev,
                              durationHours: hours,
                              duration: totalMinutes.toString()
                            }));
                          }}
                          className="w-full px-4 py-2 text-sm rounded-md border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Hours</option>
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <select
                          id="durationMinutes"
                          name="durationMinutes"
                          value={formData.durationMinutes || ''}
                          onChange={(e) => {
                            const minutes = e.target.value;
                            const hours = formData.durationHours || '0';
                            const totalMinutes = (parseInt(hours) * 60) + parseInt(minutes);
                            setFormData(prev => ({
                              ...prev,
                              durationMinutes: minutes,
                              duration: totalMinutes.toString()
                            }));
                          }}
                          className="w-full px-4 py-2 text-sm rounded-md border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Minutes</option>
                          <option value="0">00</option>
                          <option value="15">15</option>
                          <option value="30">30</option>
                          <option value="45">45</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                
                
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-1.5" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full h-20 px-4 py-2 text-sm rounded-md border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    rows="2"
                    placeholder="Additional details..."
                  />
                </div>
                
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                  >
                    {editingId ? 'Update' : 'Add Class'}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({
                          className: '',
                          subject: '',
                          schedule: '',
                          duration: '',
                          durationHours: '',
                          durationMinutes: '',
                          room: '',
                          description: '',
                          mcqs: []
                        });
                        setSelectedDateTime('');
                      }}
                      className="w-full bg-gray-100 text-indigo-700 py-2.5 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {/* Class List */}
            <div className="bg-white p-7 rounded-lg shadow-sm border border-indigo-100">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3">
                <h2 className="text-lg font-semibold text-indigo-700">
                  Your Classes
                </h2>
                <div className="relative w-full sm:w-52">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 text-sm rounded-md border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <svg
                    className="absolute right-3 top-2 h-4 w-4 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              
              {filteredClasses.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-[400px]">
                  <div className="flex justify-center items-center mb-3">
                    <svg 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-40 h-40 text-indigo-300"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-indigo-600">
                    {classes.length === 0 
                      ? "No classes added yet" 
                      : "No matching classes"}
                  </h3>
                </div>
              ) : (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                  {filteredClasses.map((classItem) => (
                    <div key={classItem.id} className="border border-indigo-100 rounded-md p-4 hover:bg-indigo-50 transition group">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 mr-2"></div>
                            <h3 className="font-medium text-sm text-indigo-800 truncate">{classItem.className}</h3>
                          </div>
                          <p className="text-xs text-indigo-600 font-medium truncate">{classItem.subject}</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                            <p className="text-xs text-indigo-500 flex items-center">
                              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0114 0z" />
                              </svg>
                              {classItem.schedule}
                            </p>
                            {classItem.duration && (
                              <p className="text-xs text-indigo-500 flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0114 0z" />
                                </svg>
                                {Math.floor(parseInt(classItem.duration) / 60)}h {parseInt(classItem.duration) % 60}m
                              </p>
                            )}
                            {classItem.room && (
                              <p className="text-xs text-indigo-500 flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {classItem.room}
                              </p>
                            )}
                          </div>
                          {classItem.description && (
                            <p className="text-xs text-indigo-400 mt-1.5 truncate">{classItem.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-1.5 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleEdit(classItem)}
                            className="p-1.5 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition"
                            title="Edit"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(classItem._id)}
                            className="p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
                            title="Delete"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleAddMCQ(classItem._id)}
                            className="p-1.5 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition"
                            title="Add MCQ"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement;