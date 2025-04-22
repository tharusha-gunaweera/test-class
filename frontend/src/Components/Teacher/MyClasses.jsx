import { useState, useEffect } from 'react';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    className: '',
    subject: '',
    schedule: '',
    room: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load classes from localStorage on component mount
  useEffect(() => {
    const savedClasses = localStorage.getItem('teacherClasses');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
  }, []);

  // Save classes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('teacherClasses', JSON.stringify(classes));
  }, [classes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing class
      setClasses(classes.map(cls => 
        cls.id === editingId ? { ...formData, id: editingId } : cls
      ));
      setEditingId(null);
    } else {
      // Add new class
      const newClass = {
        ...formData,
        id: Date.now().toString()
      };
      setClasses([...classes, newClass]);
    }
    
    // Reset form
    setFormData({
      className: '',
      subject: '',
      schedule: '',
      room: '',
      description: ''
    });
  };

  const handleEdit = (classItem) => {
    setFormData({
      className: classItem.className,
      subject: classItem.subject,
      schedule: classItem.schedule,
      room: classItem.room,
      description: classItem.description
    });
    setEditingId(classItem.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(cls => cls.id !== id));
    }
  };

  const filteredClasses = classes.filter(cls => 
    cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.schedule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-[500px] bg-gradient-to-br from-indigo-50 to-purple-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-700 mb-2">
            Class Management
          </h1>
          <p className="text-sm text-indigo-600">
            Organize your teaching schedule
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add/Edit Class Form */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-indigo-100">
            <h2 className="text-lg font-semibold mb-4 text-center text-indigo-700">
              {editingId ? 'Edit Class' : 'Add Class'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-indigo-700 mb-1" htmlFor="className">
                  Class Name
                </label>
                <input
                  type="text"
                  id="className"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-sm rounded-md border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  placeholder="e.g., Advanced Math"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-indigo-700 mb-1" htmlFor="subject">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-sm rounded-md border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  placeholder="e.g., Calculus"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-indigo-700 mb-1" htmlFor="schedule">
                    Schedule
                  </label>
                  <input
                    type="text"
                    id="schedule"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-sm rounded-md border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Mon/Wed 10:00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-indigo-700 mb-1" htmlFor="room">
                    Room
                  </label>
                  <input
                    type="text"
                    id="room"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-sm rounded-md border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Bldg 3, Rm 205"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-indigo-700 mb-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-sm rounded-md border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="2"
                  placeholder="Additional details..."
                />
              </div>
              
              <div className="pt-1 space-y-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
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
                        room: '',
                        description: ''
                      });
                    }}
                    className="w-full bg-gray-100 text-indigo-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          {/* Class List */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-indigo-100">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
              <h2 className="text-lg font-semibold text-indigo-700">
                Your Classes
              </h2>
              <div className="relative w-full sm:w-48">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-8 py-1.5 text-sm rounded-md border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <svg
                  className="absolute right-2 top-1.5 h-4 w-4 text-indigo-400"
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
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 mb-2 text-indigo-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-indigo-600">
                  {classes.length === 0 
                    ? "No classes added yet" 
                    : "No matching classes"}
                </h3>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {filteredClasses.map((classItem) => (
                  <div key={classItem.id} className="border border-indigo-100 rounded-md p-3 hover:bg-indigo-50 transition group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <div className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></div>
                          <h3 className="font-medium text-sm text-indigo-800 truncate">{classItem.className}</h3>
                        </div>
                        <p className="text-xs text-indigo-600 font-medium truncate">{classItem.subject}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                          <p className="text-xs text-indigo-500 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0114 0z" />
                            </svg>
                            {classItem.schedule}
                          </p>
                          {classItem.room && (
                            <p className="text-xs text-indigo-500 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleEdit(classItem)}
                          className="p-1 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition"
                          title="Edit"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(classItem.id)}
                          className="p-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
                          title="Delete"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
      </div>
    </div>
  );
};

export default ClassManagement;