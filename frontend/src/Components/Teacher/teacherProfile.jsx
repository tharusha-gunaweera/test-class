import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiSave, FiCamera, FiX } from 'react-icons/fi';

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTeacher, setEditableTeacher] = useState({});
  const [profilePic, setProfilePic] = useState('');
  const [tempProfilePic, setTempProfilePic] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const teacherData = JSON.parse(userData);
      setTeacher(teacherData);
      setEditableTeacher(teacherData);
      setProfilePic(teacherData.profilePic || '');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableTeacher((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    const updatedTeacher = {
      ...editableTeacher,
      profilePic: tempProfilePic || profilePic
    };
    
    localStorage.setItem('user', JSON.stringify(updatedTeacher));
    setTeacher(updatedTeacher);
    setProfilePic(tempProfilePic || profilePic);
    setTempProfilePic('');
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditableTeacher(teacher);
    setTempProfilePic('');
    setIsEditing(false);
  };

  if (!teacher) return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center text-blue-800 text-lg">Loading profile...</div>
    </div>
  );

  const { name } = editableTeacher || {};

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900">Teacher Profile</h1>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiEdit /> Edit Profile
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 min-w-[200px]">
            <div className="relative w-32 h-32 rounded-full bg-gray-100 overflow-hidden">
              <img 
                src={tempProfilePic || profilePic || '/default-avatar.png'} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white cursor-pointer transition-all hover:bg-opacity-70">
                  <label htmlFor="profile-upload" className="flex flex-col items-center cursor-pointer">
                    <FiCamera size={24} />
                    <span className="text-xs mt-2">Change Photo</span>
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editableTeacher.name || ''}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <>{name || "Not specified"}</>
              )}
            </h2>
          </div>

          {/* Info Section - Removed school and subject fields */}
        </div>

        {/* Professional Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-6 pb-2 border-b border-gray-200">Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Years of Experience</label>
              {isEditing ? (
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={editableTeacher.yearsOfExperience || ''}
                  onChange={handleInputChange}
                  placeholder="Years of experience"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-800 py-1">
                  {editableTeacher.yearsOfExperience ? `${editableTeacher.yearsOfExperience} years` : 'Not specified'}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Qualifications</label>
              {isEditing ? (
                <input
                  type="text"
                  name="qualifications"
                  value={editableTeacher.qualifications || ''}
                  onChange={handleInputChange}
                  placeholder="Qualifications"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-800 py-1">{editableTeacher.qualifications || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Teaching Philosophy</label>
              {isEditing ? (
                <textarea
                  name="teachingPhilosophy"
                  value={editableTeacher.teachingPhilosophy || ''}
                  onChange={handleInputChange}
                  placeholder="Your teaching philosophy"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-800 py-1">{editableTeacher.teachingPhilosophy || 'Not specified'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-6 pb-2 border-b border-gray-200">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={editableTeacher.dob || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-800 py-1">{editableTeacher.dob || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={editableTeacher.gender || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className="text-gray-800 py-1">{editableTeacher.gender || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editableTeacher.email || ''}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-800 py-1">{editableTeacher.email || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={editableTeacher.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-800 py-1">{editableTeacher.phone || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={editableTeacher.address || ''}
                  onChange={handleInputChange}
                  placeholder="Address"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-800 py-1">{editableTeacher.address || 'Not specified'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-4 mt-6">
            <button 
              onClick={cancelEdit}
              className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FiX /> Cancel
            </button>
            <button 
              onClick={saveProfile}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiSave /> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;