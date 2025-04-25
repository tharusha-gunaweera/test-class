import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiSearch, FiPlus } from 'react-icons/fi';
import axios from "axios";
import Navbar from "./Navbar";
import EditForm from './EditForm';
import AddMcqForm from './AddMcqForm';

function McqSection({ classId, className, onBack }) {
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMcqId, setEditingMcqId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchMcqs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/Classes/${classId}`);
      setMcqs(response.data.mcqs || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (classId) {
      fetchMcqs();
    }
  }, [classId]);

  const filteredMcqs = mcqs.filter(mcq =>
    mcq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (mcqId) => setEditingMcqId(mcqId);

  const handleAddClick = () => setShowAddForm(true);
  const handleCancelAdd = () => setShowAddForm(false);

  const handleAddMcq = async (newMcq) => {
    try {
      const classData = await axios.get(`http://localhost:5000/Classes/${classId}`);
      
      // Ensure the MCQ has all required fields
      const formattedMcq = {
        question: newMcq.question.trim(),
        options: newMcq.options.map(opt => opt.trim()),
        correctAnswer: parseInt(newMcq.correctAnswer)
      };

      // Create updated class data with new MCQ
      const updatedClass = {
        ...classData.data,
        mcqs: [...(classData.data.mcqs || []), formattedMcq]
      };

      // Send PUT request to update class
      const response = await axios.put(`http://localhost:5000/Classes/${classId}`, updatedClass);
      
      // Update local state
      setMcqs(response.data.mcqs || []);
      setShowAddForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteMcq = async (mcqId) => {
    try {
      const classData = await axios.get(`http://localhost:5000/Classes/${classId}`);
      const updatedMcqs = classData.data.mcqs.filter(mcq => mcq._id !== mcqId);
      
      await axios.put(`http://localhost:5000/Classes/${classId}`, {
        ...classData.data,
        mcqs: updatedMcqs
      });
      
      await fetchMcqs();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center ml-64 bg-gray-100">
      <p>Loading MCQs...</p>
    </div>
  );

  if (error) return (
    <div className="flex h-screen items-center justify-center ml-64 bg-gray-100">
      <p className="text-red-500">Error: {error}</p>
    </div>
  );

  return (
    <div className="ml-64 p-6 min-h-screen bg-gray-100" style={{ backgroundColor: "#eff2f4" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold">MCQs for {className}</h2>
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-800 mt-2"
            >
              ← Back to Classes
            </button>
          </div>
          <div className="flex w-full sm:w-auto gap-3">
            <div className="relative flex-1 sm:w-64">
              <FiSearch className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400" />
              <input
                type="text"
                placeholder="Search MCQs..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddClick}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FiPlus className="mr-2" />
              Add MCQ
            </button>
          </div>
        </div>

        {showAddForm && (
          <AddMcqForm
            classId={classId}
            onSave={handleAddMcq}
            onCancel={handleCancelAdd}
          />
        )}

        {filteredMcqs.length > 0 ? (
          <div className="space-y-4">
            {filteredMcqs.map((mcq) => (
              <div key={mcq._id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{mcq.question}</h3>
                    <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                      <span>Uploaded: {new Date(mcq.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      onClick={() => handleEditClick(mcq._id)}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      onClick={() => handleDeleteMcq(mcq._id)}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {mcq.options.map((option, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded border ${
                        index === mcq.correctAnswer 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : 'border-gray-200'
                      }`}
                    >
                      {option}
                      {index === mcq.correctAnswer && (
                        <span className="ml-2 text-xs font-medium">(Correct)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {searchTerm ? 'No matching MCQs found' : 'No MCQs available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default McqSection;