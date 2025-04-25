import React, { useState } from 'react';
import axios from 'axios';

const AddMcqForm = ({ classId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.question.trim()) {
        throw new Error('Question is required');
      }

      // Check for duplicate options
      const optionsSet = new Set(formData.options);
      if (optionsSet.size !== formData.options.length) {
        throw new Error('Options must be unique');
      }

      if (formData.options.some(option => !option.trim())) {
        throw new Error('All options must be filled');
      }

      // Create new MCQ with proper structure
      const newMcq = {
        question: formData.question.trim(),
        options: formData.options.map(opt => opt.trim()),
        correctAnswer: parseInt(formData.correctAnswer)
      };

      // Reset form
      setFormData({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });

      // Notify parent component with the new MCQ
      onSave(newMcq);
    } catch (err) {
      setError(err.message || 'Failed to save MCQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Add New MCQ</h3>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Question</label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Options (Mark correct answer)</label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  required
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={formData.correctAnswer === index}
                  onChange={() => setFormData(prev => ({ ...prev, correctAnswer: index }))}
                  className="ml-2"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Add MCQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMcqForm;
