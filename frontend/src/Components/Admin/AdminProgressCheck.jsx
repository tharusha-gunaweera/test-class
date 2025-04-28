import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import Navbar from './Navbar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const UserAnalyticsDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Users');
        if (response.data && response.data.Users) {
          setUsers(response.data.Users);
          if (response.data.Users.length > 0) {
            setSelectedUser(response.data.Users[0]);
          }
        }
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!selectedUser) return;
      
      try {
        console.log('Fetching progress for user:', selectedUser._id);
        const response = await axios.get(`http://localhost:5000/ProgressRouter/user/${selectedUser._id}`);
        console.log('Progress API Response:', response.data);
        
        if (response.data) {
          setUserProgress(response.data);
          console.log('Progress data set:', response.data);
        } else {
          console.log('No progress data found');
          setUserProgress(null);
        }
      } catch (err) {
        console.error('Error fetching user progress:', err);
        console.error('Error details:', err.response?.data);
        setUserProgress(null);
      }
    };

    fetchUserProgress();
  }, [selectedUser]);

  const handleDeleteProgress = async () => {
    if (!selectedUser || !userProgress) return;

    try {
      await axios.delete(`http://localhost:5000/ProgressRouter/${userProgress._id}`);
      setUserProgress(null);
      setShowDeleteConfirm(false);
      // Refresh the progress data
      const response = await axios.get(`http://localhost:5000/ProgressRouter/user/${selectedUser._id}`);
      if (response.data) {
        setUserProgress(response.data);
      } else {
        setUserProgress(null);
      }
    } catch (err) {
      console.error('Error deleting progress:', err);
      setError('Failed to delete progress');
    }
  };

  // Data for the pie chart
  const chartData = userProgress ? {
    labels: ['Correct Answers', 'Wrong Answers', 'Unanswered'],
    datasets: [
      {
        data: [
          userProgress.greenFlagCount || 0,
          userProgress.orangeFlagCount || 0,
          userProgress.redFlagCount || 0
        ],
        backgroundColor: [
          '#10B981', // green
          '#F59E0B', // orange
          '#EF4444', // red
        ],
        borderColor: [
          '#047857', // dark green
          '#B45309', // dark orange
          '#B91C1C', // dark red
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  console.log('Current userProgress:', userProgress);
  console.log('Current chartData:', chartData);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Navbar />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Navbar />
        <div className="flex-1 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar />
      <div className="w-1/3 bg-white ml-[400px] border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Users</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li 
                key={user._id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedUser?._id === user._id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <div className="flex space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        {userProgress?.greenFlagCount || 0} Correct
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                        {userProgress?.orangeFlagCount || 0} Wrong
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        {userProgress?.redFlagCount || 0} Unanswered
                      </span>
                    </div>
                  </div>
                  {selectedUser?._id === user._id && (
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Section - Pie Chart */}
      <div className="w-1/3 p-8">
        <div className="bg-white rounded-lg shadow p-6 h-full">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">User Analytics</h2>
              <p className="text-gray-600 mt-1">
                Response statistics for <span className="font-semibold text-blue-600">{selectedUser?.username || 'No user selected'}</span>
              </p>
            </div>
            {userProgress && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                title="Delete Progress"
              >
                <FaTrash className="w-5 h-5" />
              </button>
            )}
          </div>

          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the progress data for {selectedUser?.username}? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteProgress}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedUser && userProgress ? (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md h-80">
                <Pie data={chartData} options={chartOptions} />
              </div>

              <div className="mt-8 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-700">Correct Answers</span>
                    </div>
                    <span className="font-medium">{userProgress.greenFlagCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-orange-500 mr-2"></div>
                      <span className="text-gray-700">Wrong Answers</span>
                    </div>
                    <span className="font-medium">{userProgress.orangeFlagCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-gray-700">Unanswered</span>
                    </div>
                    <span className="font-medium">{userProgress.redFlagCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Progress Data Available</h3>
                <p className="mt-1 text-gray-500">Progress data is not available for this user yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsDashboard;