import { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "../../Animations/signupAnimation.json";
import { Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    school: "",
    address: "",
    grade: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasMinLength: false,
    noSpaces: true
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const passwordRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsFocus(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);




  const validateInput = (value, fieldName) => {
    if (!value) return "";
    
    if (fieldName === "email") {
      const emailStartRegex = /^[!@#$%^&*(),?":{}|<>\/\\]/;
      const allowedEmailStart = /^[@.]/;
      if (emailStartRegex.test(value) && !allowedEmailStart.test(value)) {
        return "Email cannot start with special symbols (except @ or .)";
      }
      return "";
    }
    
    const specialSymbolsRegex = /^[!@#$%^&*(),.?":{}|<>\/\\]/;
    if (specialSymbolsRegex.test(value)) {
      return `${fieldName} cannot start with special symbols`;
    }
    return "";
  };

  const validatePassword = (password) => {
    const validations = {
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasMinLength: password.length >= 8,
      noSpaces: !/^\s|\s$/.test(password)
    };
    setPasswordValidation(validations);
    return validations;
  };




  



  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "password") {
      validatePassword(value);
    }
    
    if (name !== "password" && name !== "confirmPassword" && name !== "grade") {
      if (value) {
        const validationError = validateInput(value, name);
        if (validationError) {
          setErrors(prev => ({ ...prev, [name]: validationError }));
          return;
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.school) newErrors.school = "School is required";
    if (!formData.grade) newErrors.grade = "Grade is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    


    const passwordValid = validatePassword(formData.password);
    if (!passwordValid.hasLowercase) {
      newErrors.password = "Password must contain a lowercase letter";
    } else if (!passwordValid.hasUppercase) {
      newErrors.password = "Password must contain an uppercase letter";
    } else if (!passwordValid.hasNumber) {
      newErrors.password = "Password must contain a number";
    } else if (!passwordValid.hasMinLength) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!passwordValid.noSpaces) {
      newErrors.password = "Password cannot have leading or trailing spaces";
    }
    
    const fieldsToValidate = ["username", "email", "school", "address"];
    fieldsToValidate.forEach(field => {
      if (formData[field]) {
        const error = validateInput(formData[field], field);
        if (error) newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    setIsLoading(true);
    
    try {
      // Check if username already exists
      const usernameExists = await axios.get(`http://localhost:5000/Users/username/${formData.username}`);
      console.log("response data username",usernameExists.data.user.length);
      if (usernameExists.data.user.length>0) {
        setErrors({ username: 'Username already taken' });
        setIsLoading(false);
        return;
      }
      
      // Check if email already exists
      const emailExists = await axios.get(`http://localhost:5000/Users/email/${formData.email}`);
      console.log("Existing before",emailExists);
      if (emailExists.data.user.length>0) {
        console.log("Existing");
        setErrors({ email: 'Email already registered' });
        setIsLoading(false);
        return;
      }
      
      // Register the user
      await axios.post("http://localhost:5000/Users", {
        username: String(formData.username),
        email: String(formData.email),
        isActive: true,
        school: String(formData.school),
        grade: Number(formData.grade),
        address: String(formData.address),
        password: String(formData.password),
        acclevel: 1 
      });
      
      setIsSuccess(true);
      setFormData({
        username: "",
        email: "",
        school: "",
        address: "",
        grade: "",
        password: "",
        confirmPassword: ""
      });
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response && error.response.data) {
        setErrors({ server: error.response.data.message || "Registration failed" });
      } else {
        setErrors({ server: "Network error. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Student Sign Up</h2>
            <p className="text-gray-600 text-base mt-2">
              Join our learning community today
            </p>
          </div>

          {errors.server && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-center">
              {errors.server}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  className={`w-full px-4 py-2 text-base rounded-xl border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none`}
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`w-full px-4 py-2 text-base rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                <input
                  type="text"
                  name="school"
                  className={`w-full px-4 py-2 text-base rounded-xl border ${errors.school ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none`}
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="School name"
                />
                {errors.school && <p className="mt-1 text-sm text-red-600">{errors.school}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <select
                  name="grade"
                  className={`w-full px-4 py-2 text-base rounded-xl border ${errors.grade ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none`}
                  value={formData.grade}
                  onChange={handleChange}
                >
                  <option value="">Select grade</option>
                  {[9, 10, 11, 12].map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </select>
                {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                className={`w-full px-4 py-2 text-base rounded-xl border ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none`}
                value={formData.address}
                onChange={handleChange}
                placeholder="Your address"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex-1 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  ref={passwordRef}
                  type="password"
                  name="password"
                  className={`w-full px-4 py-2 text-base rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none`}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => {
                    if (!formData.password) {
                      setShowPasswordRequirements(false);
                    }
                  }}
                  placeholder="Create password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                
                {(showPasswordRequirements || formData.password) && (
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
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`w-full px-4 py-2 text-base rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="mt-2">
              <button
                type="submit"
                className="w-full mt-6 py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up Now'}
              </button>
              
              {isSuccess && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-center">
                  Account created successfully! You can now log in.
                </div>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 items-center justify-center p-12">
        <div className="max-w-lg">
          <Lottie 
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ height: 450, width: 450 }}
          />
          <h3 className="text-2xl font-bold text-indigo-800 mt-6 text-center">
            Start Your Learning Journey
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Signup;