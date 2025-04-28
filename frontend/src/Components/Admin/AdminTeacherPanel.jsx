import React, { useState, useEffect, useMemo } from 'react';
import {
  FaTrash,
  FaSearch,
  FaUserTie,
  FaTimesCircle,
  FaLock,
  FaLockOpen,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaTimes,
} from 'react-icons/fa';
import Navbar from './Navbar';
import axios from 'axios';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    username: '',
    email: '',
    password: '',
    subject: '',
    qualifications: '',
    yearsOfExperience: '',
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [passwordValidation, setPasswordValidation] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasMinLength: false,
    noSpaces: true,
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/Users');
        const usersData = (res.data.Users || []).filter(
          (user) => user.acclevel >= 2
        );
        setTeachers(usersData);
        setError(null);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setError('Failed to fetch teachers');
        setTeachers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const validatePassword = (password) => {
    const validations = {
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasMinLength: password.length >= 8,
      noSpaces: !/^\s|\s$/.test(password),
    };
    setPasswordValidation(validations);
    return validations;
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    
    if (!newTeacher.username || !newTeacher.email || !newTeacher.password || 
        !newTeacher.subject || !newTeacher.qualifications) {
      setError('All fields are required');
      return;
    }

    const passwordValid = validatePassword(newTeacher.password);
    if (!passwordValid.hasLowercase || !passwordValid.hasUppercase || 
        !passwordValid.hasNumber || !passwordValid.hasMinLength || !passwordValid.noSpaces) {
      setError('Password does not meet requirements');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/Users', {
        username: newTeacher.username,
        email: newTeacher.email,
        password: newTeacher.password,
        subject: newTeacher.subject,
        qualifications: newTeacher.qualifications,
        yearsOfExperience: newTeacher.yearsOfExperience || 0,
        acclevel: 2,
        isActive: true,
      });

      if (response.status === 201) {
        const res = await axios.get('http://localhost:5000/Users');
        const usersData = (res.data.Users || []).filter(
          (user) => user.acclevel === 2
        );
        setTeachers(usersData);
        setNewTeacher({
          username: '',
          email: '',
          password: '',
          subject: '',
          qualifications: '',
          yearsOfExperience: '',
        });
        setShowAddModal(false);
        setError(null);
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      setError(error.response?.data?.message || 'Failed to add teacher');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async (id) => {
    try {
      const teacher = teachers.find((t) => t._id === id);
      if (!teacher) return;

      const response = await axios.put(`http://localhost:5000/Users/${id}`, {
        isActive: !teacher.isActive,
      });

      if (response.data.user) {
        setTeachers((prev) =>
          prev.map((teacher) =>
            teacher._id === id
              ? { ...teacher, isActive: !teacher.isActive }
              : teacher
          )
        );
      }
    } catch (error) {
      console.error('Error blocking teacher:', error);
      setError('Failed to block teacher');
    }
  };

  const handleDelete = async () => {
    if (!teacherToDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/Users/${teacherToDelete._id}`);
      if (response.status !== 200) {
        alert('Error deleting user!');
        return;
      }
      const deletedUserWithTimestamp = {
        ...teacherToDelete,
        deletedAt: new Date().toLocaleString(),
      };
      setDeletedUsers((prev) => [...prev, deletedUserWithTimestamp]);
      setTeachers((prev) => prev.filter((teacher) => teacher._id !== teacherToDelete._id));
      setConfirmDelete(false);
      setTeacherToDelete(null);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      setError('Failed to delete teacher');
    }
  };

  const generateCSV = () => {
    if (deletedUsers.length === 0) {
      alert('No deleted teachers to generate a report.');
      return;
    }

    try {
      const headers = 'Name,Email,Role,Deleted At\n';
      const rows = deletedUsers
        .map(
          (user) =>
            `${user.username},${user.email},${user.acclevel === 0 ? 'Admin' : 'Teacher'},${
              user.deletedAt || new Date().toLocaleString()
            }`
        )
        .join('\n');

      const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'deleted_teachers_report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Error generating CSV file.');
      console.error(error);
    }
  };

  const handleToggleRole = async (id) => {
    const teacher = teachers.find((t) => t._id === id);
    if (!teacher) return;

    try {
      console.log('Current teacher:', teacher);
      const newAccLevel = teacher.acclevel === 2 ? 3 : 2;
      console.log('New access level:', newAccLevel);
      
      const response = await axios.put(`http://localhost:5000/Users/${id}`, {
        acclevel: newAccLevel,
      });

      console.log('Backend response:', response.data);

      if (response.data.user) {
        setTeachers((prev) =>
          prev.map((t) =>
            t._id === id ? { ...t, acclevel: newAccLevel } : t
          )
        );
        console.log('Updated teachers state:', teachers);
      }
    } catch (error) {
      console.error('Error changing role:', error);
      console.error('Error response:', error.response);
      setError('Failed to change role');
    }
  };

  const filteredTeachers = useMemo(
    () =>
      teachers.filter(
        (teacher) =>
          teacher.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [teachers, searchQuery]
  );

  return (
    <div className="min-h-screen bg-sky-100 p-6">
      <Navbar />
      <div className="ml-[260px] max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <FaUserTie className="text-purple-600 text-3xl mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Teacher Management</h1>
          </div>
          <button
            className="flex items-center bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus className="mr-2" /> Add Teacher
          </button>
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
            placeholder="Search teachers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-400"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
            <h3 className="text-xl text-gray-700 font-medium mb-2">No teachers found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try a different search term' : 'No teachers in the system yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="grid grid-cols-12 bg-gray-100 p-4 text-gray-600 font-medium text-sm uppercase tracking-wider">
              <div className="col-span-3">Teacher</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {filteredTeachers.map((teacher) => (
              <div
                key={teacher._id}
                className="grid grid-cols-12 items-center p-4 hover:bg-purple-50/50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="col-span-3 flex items-center">
                  <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-medium">
                      {teacher.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium">{teacher.username}</p>
                </div>

                <div className="col-span-3 text-gray-700">{teacher.email}</div>

                <div className="col-span-2">
                  {teacher.isActive ? (
                    <div className="flex items-center">
                      <FaLockOpen className="text-green-500 mr-2" />
                      <span className="text-green-600">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FaLock className="text-red-500 mr-2" />
                      <span className="text-red-600">Blocked</span>
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <span className={`font-semibold ${teacher.acclevel === 3 ? 'text-blue-600' : 'text-gray-600'}`}>
                    {teacher.acclevel === 3 ? 'Admin' : 'Teacher'}
                  </span>
                </div>

                <div className="col-span-2 flex justify-end space-x-2">
                  <button
                    onClick={() => handleBlock(teacher._id)}
                    className={`p-2 rounded-lg ${
                      !teacher.isActive
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                    } transition-colors`}
                    title={!teacher.isActive ? 'Unblock Teacher' : 'Block Teacher'}
                  >
                    {!teacher.isActive ? <FaLockOpen /> : <FaLock />}
                  </button>

                  <button
                    onClick={() => handleToggleRole(teacher._id)}
                    className={`p-2 rounded-lg ${
                      teacher.acclevel === 0
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    } transition-colors`}
                    title={teacher.acclevel === 0 ? 'Demote to Teacher' : 'Promote to Admin'}
                  >
                    {teacher.acclevel === 0 ? <FaArrowDown /> : <FaArrowUp />}
                  </button>

                  <button
                    onClick={() => {
                      setTeacherToDelete(teacher);
                      setConfirmDelete(true);
                    }}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Delete Teacher"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTeachers.length > 0 && (
          <div className="mt-4 text-right text-sm text-gray-500">
            Showing {filteredTeachers.length} of {teachers.length} teachers
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            onClick={generateCSV}
          >
            Download Deleted Teachers Report
          </button>
        </div>

        {/* Add Teacher Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Add New Teacher</h3>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={newTeacher.username}
                    onChange={(e) => setNewTeacher({...newTeacher, username: e.target.value})}
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={newTeacher.subject}
                    onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                    placeholder="Subject taught"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={newTeacher.qualifications}
                    onChange={(e) => setNewTeacher({...newTeacher, qualifications: e.target.value})}
                    placeholder="Teacher qualifications"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={newTeacher.yearsOfExperience}
                    onChange={(e) => setNewTeacher({...newTeacher, yearsOfExperience: e.target.value})}
                    placeholder="Years of experience"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={newTeacher.password}
                    onChange={(e) => {
                      setNewTeacher({...newTeacher, password: e.target.value});
                      validatePassword(e.target.value);
                    }}
                    onFocus={() => setShowPasswordRequirements(true)}
                    onBlur={() => {
                      if (!newTeacher.password) {
                        setShowPasswordRequirements(false);
                      }
                    }}
                    placeholder="Create password"
                    required
                  />
                  {(showPasswordRequirements || newTeacher.password) && (
                    <div className="absolute z-10 mt-1 w-full p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                        <p className={`flex items-center ${passwordValidation.hasLowercase ? "text-green-500" : ""}`}>
                          <span className="mr-1">{passwordValidation.hasLowercase ? "✓" : "•"}</span>
                          Lowercase
                        </p>
                        <p className={`flex items-center ${passwordValidation.hasUppercase ? "text-green-500" : ""}`}>
                          <span className="mr-1">{passwordValidation.hasUppercase ? "✓" : "•"}</span>
                          Uppercase
                        </p>
                        <p className={`flex items-center ${passwordValidation.hasNumber ? "text-green-500" : ""}`}>
                          <span className="mr-1">{passwordValidation.hasNumber ? "✓" : "•"}</span>
                          Number
                        </p>
                        <p className={`flex items-center ${passwordValidation.hasMinLength ? "text-green-500" : ""}`}>
                          <span className="mr-1">{passwordValidation.hasMinLength ? "✓" : "•"}</span>
                          8+ chars
                        </p>
                        <p className={`flex items-center ${passwordValidation.noSpaces ? "text-green-500" : ""}`}>
                          <span className="mr-1">{passwordValidation.noSpaces ? "✓" : "•"}</span>
                          No spaces
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setError(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Adding...' : 'Add Teacher'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Confirm Delete</h3>
                <button 
                  onClick={() => {
                    setConfirmDelete(false);
                    setTeacherToDelete(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <p className="mb-6 text-gray-700">
                Are you sure you want to delete {teacherToDelete?.username}?
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDelete(false);
                    setTeacherToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherManagement;