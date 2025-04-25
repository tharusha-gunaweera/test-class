import { useState,useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import animationData from "../../Animations/loginAnimation.json"; 

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();



  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
  
    if (userData && token) {
      try {
        const user = JSON.parse(userData);
        const role = user.acclevel;
  
        switch (role) {
          case 1: // Student
            navigate('/Dashboard');
            break;
          case 2: // Teacher
            navigate('/TeacherDashboard');
            break;
          case 3: // Admin
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    
    try {
      // For admin login
      if (isAdmin) {
        console.log('Starting admin login process...');
        console.log('Admin login data:', { email, password, acclevel: [2, 3] });
        
        const requestBody = {
          username: email,
          password,
          acclevel: [2, 3]
        };
        console.log('Request body:', requestBody);
        
        const response = await fetch('http://localhost:5000/Users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('Admin login response status:', response.status);
        const responseData = await response.text();
        console.log('Raw admin login response:', responseData);

        if (!response.ok) {
          const errorData = JSON.parse(responseData);
          throw new Error(errorData.message || 'Login failed. Please check your credentials.');
        }

        const data = JSON.parse(responseData);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        const userRole = data.user.acclevel;

        switch(userRole) {
          case 2: // Teacher
            navigate('/TeacherDashboard');
            break;
          case 3: // Admin
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
        return;
      } else {
        // For student/teacher login
        const response = await fetch('http://localhost:5000/Users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            acclevel: 1 // Default to student level
          }),
        });

        const responseData = await response.text();

        if (!response.ok) {
          const errorData = JSON.parse(responseData);
          throw new Error(errorData.message || 'Login failed. Please check your credentials.');
        }

        const data = JSON.parse(responseData);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        navigate('/Dashboard');
        return;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[690px] flex bg-gradient-to-r from-blue-50 to-indigo-50 ">
      
      <div className="hidden md:flex w-1/2 items-center justify-center p-12">
        <div className="max-w-md">
        <Lottie 
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ height: 400, width: 400 }}
          />
    
          <h3 className="text-2xl font-bold text-indigo-800 mt-6 text-center">
            Welcome to Gathika Online Platform
          </h3>
          <p className="text-indigo-600 text-center mt-2">
            Where learning meets innovation
          </p>
        </div>
      </div>

      
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {isAdmin ? "Admin Portal" : "Student Portal"}
            </h2>
            <p className="text-gray-600 mt-2">
              Sign in to access your {isAdmin ? "admin" : "student"} dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isAdmin ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@admin.com"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAdmin"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
                <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
                  Admin/Teacher login
                </label>
              </div>

              <Link to="/signup" className="text-sm text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{'  '}
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Contact administrator
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;