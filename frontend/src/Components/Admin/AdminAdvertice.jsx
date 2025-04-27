import { useState, useEffect } from 'react';

const AdvertisementManager = () => {

  const [formData, setFormData] = useState({
    date: '',
    month: '',
    topic: '',
    description: ''
  });


  const [advertisements, setAdvertisements] = useState([]);
  

  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.date || formData.date < 1 || formData.date > 31) {
      alert('Please enter a valid date (1-31)');
      return false;
    }
    if (!formData.month) {
      alert('Please select a month');
      return false;
    }
    if (!formData.topic.trim()) {
      alert('Please enter a topic');
      return false;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (isEditing) {
      // Update existing advertisement
      setAdvertisements(advertisements.map(ad => 
        ad.id === editingId ? { ...formData, id: editingId } : ad
      ));
      setIsEditing(false);
      setEditingId(null);
    } else {
      // Add new advertisement
      const newAd = {
        ...formData,
        id: Date.now() // Simple unique ID
      };
      setAdvertisements([...advertisements, newAd]);
    }

    // Reset form
    setFormData({
      date: '',
      month: '',
      topic: '',
      description: ''
    });
  };

  // Handle edit
  const handleEdit = (id) => {
    const adToEdit = advertisements.find(ad => ad.id === id);
    if (adToEdit) {
      setFormData(adToEdit);
      setIsEditing(true);
      setEditingId(id);
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      setAdvertisements(advertisements.filter(ad => ad.id !== id));
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      date: '',
      month: '',
      topic: '',
      description: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advertisement Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Add, edit, or delete advertisements
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {isEditing ? 'Edit Advertisement' : 'Add New Advertisement'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Date Field */}
              <div className="sm:col-span-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date (1-31)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="date"
                    id="date"
                    min="1"
                    max="31"
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    required
                  />
                </div>
              </div>

              {/* Month Dropdown */}
              <div className="sm:col-span-2">
                <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                  Month
                </label>
                <div className="mt-1">
                  <select
                    id="month"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    required
                  >
                    <option value="">Select a month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Topic Field */}
              <div className="sm:col-span-6">
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                  Topic
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="topic"
                    id="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    required
                  />
                </div>
              </div>

              {/* Description Field */}
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isEditing ? 'Update' : 'Save'} Advertisement
              </button>
            </div>
          </form>
        </div>

        {/* Advertisements List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Existing Advertisements</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {advertisements.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">
                No advertisements added yet
              </li>
            ) : (
              advertisements.map((ad) => (
                <li key={ad.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">
                        {ad.date} {ad.month} - {ad.topic}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{ad.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(ad.id)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementManager;