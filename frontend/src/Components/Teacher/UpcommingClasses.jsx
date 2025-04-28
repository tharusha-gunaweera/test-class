import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';

const UpcommingClasses = () => {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error parsing user data:', err);
        setError('Error loading user data');
      }
    }
  }, []);

  const loadClasses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/Classes');
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }

      const transformedClasses = response.data.map(cls => {
        try {
          return {
            id: cls._id || '',
            lectureTopic: cls.className || 'Untitled Class',
            description: cls.description || 'No description available',
            startDate: cls.schedule ? new Date(cls.schedule) : new Date(),
            duration: cls.duration ? `${cls.duration} mins` : 'Duration not specified',
            instructor: cls.teacherName || 'Instructor not specified',
            subject: cls.subject || 'Subject not specified',
            room: cls.room || 'Online'
          };
        } catch (err) {
          console.error('Error transforming class data:', err);
          return null;
        }
      }).filter(Boolean); // Remove any null entries from transformation errors

      const sortedClasses = transformedClasses.sort((a, b) => a.startDate - b.startDate);
      setClasses(sortedClasses);
    } catch (error) {
      console.error('Error loading classes:', error);
      setError('Failed to load classes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const filteredClasses = classes.filter((cls) => {
    if (!searchTerm.trim()) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    const searchableFields = [
      cls.lectureTopic,
      cls.description,
      cls.instructor,
      cls.subject,
      cls.room
    ];

    return searchableFields.some(field => 
      field && field.toString().toLowerCase().includes(searchTermLower)
    );
  });

  const formatDate = (date) => {
    try {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />
      <div className="w-64 bg-gray-800"></div>

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Upcoming Classes</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search classes by topic, description, instructor, subject, or room..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClasses.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No classes found matching your search.' : 'No upcoming classes available.'}
                </p>
              </div>
            ) : (
              filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{cls.lectureTopic}</h2>
                        <p className="text-gray-600 mt-1">{cls.description}</p>
                        <div className="mt-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {formatDate(cls.startDate)} • {cls.duration}
                          </span>
                          <span className="flex items-center mt-1">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Instructor: {cls.instructor}
                          </span>
                          <span className="flex items-center mt-1">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            Room: {cls.room}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/VideoPlatform?userName=${encodeURIComponent(user?.username || '')}&meetingId=${cls.id}&isMeetingCreater=${true}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                      >
                        Join Class
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcommingClasses;