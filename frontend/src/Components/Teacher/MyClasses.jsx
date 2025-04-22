import React from 'react';

function MyClasses() {
  const handleAttendMeeting = () => {
    
    window.location.href = '/meeting';
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        onClick={handleAttendMeeting}
        className="bg-green-500 hover:bg-green-600 text-white 
                 font-bold py-4 px-10 rounded-lg text-xl 
                 transition duration-300 ease-in-out 
                 transform hover:scale-105 shadow-lg"
      >
        Attend Meeting
      </button>
    </div>
  );
}

export default MyClasses;