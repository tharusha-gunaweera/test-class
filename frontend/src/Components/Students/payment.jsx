import React, { useState } from 'react';
import Navbar from "./Navbar";
import Lottie from "lottie-react"
import animationData from "../Animations/creditCard.json";
import { useNavigate } from "react-router";
import axios from 'axios';
// import { Player } from '@lottiefiles/react-lottie-player';

function AddPayment() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    studentName: "",
    studentId: "",
    studyingYear: "",
    courseName: "",
    paymentMonth: "",
    cardNumber: "",
    amount: "",
    cvv: "",
    expiryDate: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send payment data to backend
      const response = await axios.post('http://localhost:5000/payments', inputs, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Payment response:', response.data); // Log successful response
      
      if (response.status === 200) {
        // Clear form
        setInputs({
          studentName: "",
          studentId: "",
          studyingYear: "",
          courseName: "",
          paymentMonth: "",
          cardNumber: "",
          amount: "",
          cvv: "",
          expiryDate: ""
        });
        
        // Navigate to success page
        history('/payment-success');
      }
    } catch (err) {
      console.error("Full error object:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
        setError(err.response.data?.message || "Payment failed. Please try again.");
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setError("No response from server. Please check if the server is running.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", err.message);
        setError("An error occurred while setting up the payment request.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Sample class data
  const classes = [
    {
      id: 1,
      name: "Advanced Mathematics",
      instructor: "Dr. Sarah Johnson",
      date: "Mon/Wed/Fri",
      time: "9:00 AM - 10:30 AM",
      subject: "Mathematics"
    },
    {
      id: 2,
      name: "Literature & Composition",
      instructor: "Prof. Michael Chen",
      date: "Tue/Thu",
      time: "11:00 AM - 12:30 PM",
      subject: "English"
    },
    {
      id: 3,
      name: "Introduction to Computer Science",
      instructor: "Dr. Alan Turing",
      date: "Mon/Wed",
      time: "2:00 PM - 3:30 PM",
      subject: "Computer Science"
    },
    {
      id: 4,
      name: "Modern Physics",
      instructor: "Prof. Marie Curie",
      date: "Tue/Thu",
      time: "4:00 PM - 5:30 PM",
      subject: "Physics"
    },
    {
      id: 4,
      name: "Modern Physics",
      instructor: "Prof. Marie Curie",
      date: "Tue/Thu",
      time: "4:00 PM - 5:30 PM",
      subject: "Physics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8">
        <Navbar />
      <div className="max-w-5xl ml-[350px] my-[20px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-100px)]">
          {/* Payment Form */}
          <div className="lg:w-1/2 bg-white rounded-lg shadow-md overflow-hidden p-4 h-full">
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32">
              <Lottie 
                animationData={animationData}
                loop={false}
                autoplay={true}
                style={{ height: '100%', width: '100%' }}
            />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="studentName" className="block text-xs font-medium text-gray-700">
                    Student Name
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    id="studentName"
                    value={inputs.studentName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="studentId" className="block text-xs font-medium text-gray-700">
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    id="studentId"
                    value={inputs.studentId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="studyingYear" className="block text-xs font-medium text-gray-700">
                    Studying Year
                  </label>
                  <select
                    name="studyingYear"
                    id="studyingYear"
                    value={inputs.studyingYear}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="courseName" className="block text-xs font-medium text-gray-700">
                    Course Name
                  </label>
                  <select
                    name="courseName"
                    id="courseName"
                    value={inputs.courseName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select Course</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.name}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="paymentMonth" className="block text-xs font-medium text-gray-700">
                  Payment Month
                </label>
                <input
                  type="month"
                  name="paymentMonth"
                  id="paymentMonth"
                  value={inputs.paymentMonth}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="cardNumber" className="block text-xs font-medium text-gray-700">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  id="cardNumber"
                  value={inputs.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="expiryDate" className="block text-xs font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="month"
                    name="expiryDate"
                    id="expiryDate"
                    value={inputs.expiryDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cvv" className="block text-xs font-medium text-gray-700">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    id="cvv"
                    value={inputs.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="amount" className="block text-xs font-medium text-gray-700">
                  Amount ($)
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={inputs.amount}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
                {error && (
                  <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
                )}
              </div>
            </form>
          </div>

          {/* Class List */}
          <div className="lg:w-1/2 h-full">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
              <div className="p-4 bg-indigo-600">
                <h2 className="text-lg font-bold text-white">Available Classes</h2>
                <p className="mt-1 text-sm text-indigo-100">Select a class to pay for</p>
              </div>
              <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
                {classes.map((cls) => (
                  <div key={cls.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{cls.name}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {cls.subject}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Instructor: {cls.instructor}</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {cls.date} • {cls.time}
                    </div>
                    <button
                      onClick={() => setInputs(prev => ({ ...prev, courseName: cls.name }))}
                      className="mt-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Select This Class
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPayment;