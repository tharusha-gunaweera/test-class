import React, { useState, useEffect } from 'react';
import { FaTrash, FaBan, FaSearch, FaUserGraduate, FaCheckCircle, FaTimesCircle, FaLock, FaLockOpen } from 'react-icons/fa';
import Navbar from './Navbar';
import axios from 'axios';

const AdminStudentPanel = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/Users');
        // Filter only users with acclevel = 1 (students)
        const usersData = (res.data.Users || []).filter(user => user.acclevel === 1);
        setStudents(usersData);
        setError(null);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to fetch students');
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleBlock = async (id) => {
    try {
      const student = students.find(s => s._id === id);
      if (!student) return;

      const response = await axios.put(`http://localhost:5000/Users/${id}`, {
        isActive: !student.isActive
      });

      if (response.data.user) {
        setStudents(prev =>
          prev.map(student =>
            student._id === id ? { ...student, isActive: !student.isActive } : student
          )
        );
      }
    } catch (error) {
      console.error('Error blocking student:', error);
      setError('Failed to block student');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Users/${id}`);
      setStudents(prev => prev.filter(student => student._id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student');
    }
  };

  const filteredStudents = Array.isArray(students) 
    ? students.filter(student =>
        student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <div className="ml-[260px] max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <FaUserGraduate className="text-blue-600 text-3xl mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">
            Student Management
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 flex items-center">
            <FaTimesCircle className="mr-2" />
            {error}
          </div>
        )}

        <div className="relative mb-8 bg-white rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" 
              alt="No students" 
              className="w-24 h-24 mx-auto mb-4 opacity-70"
            />
            <h3 className="text-xl text-gray-700 font-medium mb-2">No students found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try a different search term' : 'No students in the system yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="grid grid-cols-12 bg-gray-100 p-4 text-gray-600 font-medium text-sm uppercase tracking-wider">
              <div className="col-span-4">Student</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="grid grid-cols-12 items-center p-4 hover:bg-blue-50/50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="col-span-4 flex items-center">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">
                      {student.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{student.username}</p>
                  </div>
                </div>
                
                <div className="col-span-4 text-gray-700">
                  {student.email}
                </div>
                
                <div className="col-span-2">
                  {!student.isActive ? (
                    <div className="flex items-center">
                      <FaLock className="text-red-500 mr-2" />
                      <span className="text-red-600">Blocked</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FaLockOpen className="text-green-500 mr-2" />
                      <span className="text-green-600">Active</span>
                    </div>
                  )}
                </div>
                
                <div className="col-span-2 flex justify-end space-x-2">
                  <button
                    onClick={() => handleBlock(student._id)}
                    className={`p-2 rounded-lg ${!student.isActive ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'} transition-colors`}
                    title={!student.isActive ? 'Unblock Student' : 'Block Student'}
                  >
                    {!student.isActive ? <FaLockOpen /> : <FaLock />}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Delete Student"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredStudents.length > 0 && (
          <div className="mt-4 text-right text-sm text-gray-500">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudentPanel;