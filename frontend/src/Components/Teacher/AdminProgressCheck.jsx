import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import Navbar from '../Teacher/Navbar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const UserAnalyticsDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [userProgressData, setUserProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch users and their progress data on component mount
  useEffect(() => {
    const fetchUsersAndProgress = async () => {
      try {
        // Fetch all users
        const usersResponse = await axios.get('http://localhost:5000/Users');
        const usersData = usersResponse.data.Users || [];
        setUsers(usersData);

        // Fetch progress for all users in parallel
        const progressPromises = usersData.map(user =>
          axios.get(`http://localhost:5000/ProgressRouter/user/${user._id}`)
            .then(res => ({ userId: user._id, progress: res.data }))
            .catch(() => ({ userId: user._id, progress: null }))
        );
        const progressResults = await Promise.all(progressPromises);
        const progressMap = progressResults.reduce((acc, { userId, progress }) => {
          if (progress) {
            acc[userId] = progress;
          }
          return acc;
        }, {});
        setUserProgressData(progressMap);

        // Set initial selected user and their progress
        if (usersData.length > 0) {
          setSelectedUser(usersData[0]);
          setUserProgress(progressMap[usersData[0]._id] || null);
        }
      } catch (err) {
        setError('Failed to fetch users or progress');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndProgress();
  }, []);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUserProgress(userProgressData[user._id] || null);
  };

  // Handle progress deletion
  const handleDeleteProgress = async () => {
    if (!selectedUser || !userProgress) return;

    try {
      await axios.delete(`http://localhost:5000/ProgressRouter/${userProgress._id}`);
      // Update userProgressData by removing the deleted progress
      setUserProgressData(prev => {
        const newData = { ...prev };
        delete newData[selectedUser._id];
        return newData;
      });
      setUserProgress(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Error deleting progress:', err);
      setError('Failed to delete progress');
    }
  };

  // Pie chart data
  const chartData = userProgress ? {
    labels: ['Correct Answers', 'Wrong Answers', 'Unanswered'],
    datasets: [
      {
        data: [
          userProgress.greenFlagCount || 0,
          userProgress.orangeFlagCount || 0,
          userProgress.redFlagCount || 0
        ],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderColor: ['#047857', '#B45309', '#B91C1C'],
        borderWidth: 1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`,
        },
      },
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
          <ul className="divide-y divide-gray-100">
            {users.map((user) => (
              <li
                key={user._id}
                className={`p-4 hover:bg-bule-5 0 cursor-pointer transition-colors ${
                  selectedUser?._id === user._id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <div className="flex space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        {userProgressData[user._id]?.greenFlagCount || 0} Correct
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                        {userProgressData[user._id]?.orangeFlagCount || 0} Wrong
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        {userProgressData[user._id]?.redFlagCount || 0} Unanswered
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