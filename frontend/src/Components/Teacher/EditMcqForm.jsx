import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const EditMcqForm = ({ mcq, onSave, onCancel }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mcq) {
      setQuestion(mcq.question);
      setOptions(mcq.options);
      setCorrectAnswer(mcq.correctAnswer);
    }
  }, [mcq]);

  const validateInput = (value, fieldName) => {
    const specialSymbolsRegex = /[!@#$%^&*(),.?":{}|<>\/\\]/;
    if (specialSymbolsRegex.test(value)) {
      return `${fieldName} cannot contain special symbols`;
    }
    return "";
  };

  const handleQuestionChange = (e) => {
    const value = e.target.value;
    const error = validateInput(value, "Question");
    if (!error) {
      setQuestion(value);
    }
    setErrors(prev => ({ ...prev, question: error }));
  };

  const handleOptionChange = (index, value) => {
    const error = validateInput(value, `Option ${index + 1}`);
    if (!error) {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
    }
    setErrors(prev => ({ ...prev, [`option${index}`]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    const questionError = validateInput(question, "Question");
    if (questionError) newErrors.question = questionError;
    
    options.forEach((option, index) => {
      const optionError = validateInput(option, `Option ${index + 1}`);
      if (optionError) newErrors[`option${index}`] = optionError;
    });

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Validate form
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    if (options.some(option => !option.trim())) {
      alert('Please fill in all options');
      return;
    }

    const updatedMcq = {
      question: question.trim(),
      options: options.map(opt => opt.trim()),
      correctAnswer: parseInt(correctAnswer)
    };

    onSave(updatedMcq);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit MCQ</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Question
            </label>
            <textarea
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.question ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={question}
              onChange={handleQuestionChange}
              rows={3}
              required
            />
            {errors.question && (
              <p className="text-red-500 text-xs mt-1">{errors.question}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Options
            </label>
            {options.map((option, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === index}
                    onChange={() => setCorrectAnswer(index)}
                    className="mr-2"
                  />
                  <input
                    type="text"
                    className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors[`option${index}`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                </div>
                {errors[`option${index}`] && (
                  <p className="text-red-500 text-xs mt-1 ml-6">{errors[`option${index}`]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMcqForm; 