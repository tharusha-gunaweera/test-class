import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const SalaryRecords = () => {
    const [salaries, setSalaries] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchSalaries();
    }, []);

    const fetchSalaries = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/salary');
            setSalaries(response.data);
        } catch (error) {
            console.error('Error fetching salaries:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await axios.delete(`http://localhost:5000/api/salary/${id}`);
                fetchSalaries();
            } catch (error) {
                console.error('Error deleting salary:', error);
            }
        }
    };

    const handleEdit = (salary) => {
        setEditingId(salary._id);
        setEditForm({
            teacherName: salary.teacherName,
            teachingSubject: salary.teachingSubject,
            teachingYear: salary.teachingYear,
            totalAmount: salary.totalAmount,
            instituteCut: salary.instituteCut
        });
    };

    const handleUpdate = async (id) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/salary/${id}`, {
                ...editForm,
                teachingYear: parseInt(editForm.teachingYear),
                totalAmount: parseFloat(editForm.totalAmount),
                instituteCut: parseFloat(editForm.instituteCut)
            });
            setSalaries(salaries.map(salary => 
                salary._id === id ? response.data : salary
            ));
            setEditingId(null);
        } catch (error) {
            console.error('Error updating salary:', error);
        }
    };

    const handleInputChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleBackToCalculator = () => {
        navigate('/SalaryForm');
    };

    return (
        <div className="max-w-6xl pl-[200px] mx-auto mt-10 p-8">
            <Navbar/>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-indigo-800">Teacher Salary Records</h2>
                <button
                    onClick={handleBackToCalculator}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                    Back to Calculator
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {salaries.map((salary) => (
                    <div key={salary._id} className="bg-white rounded-xl shadow-lg p-6">
                        {editingId === salary._id ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Teacher Name</label>
                                        <input
                                            type="text"
                                            name="teacherName"
                                            value={editForm.teacherName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Teaching Subject</label>
                                        <input
                                            type="text"
                                            name="teachingSubject"
                                            value={editForm.teachingSubject}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Teaching Year</label>
                                        <input
                                            type="number"
                                            name="teachingYear"
                                            value={editForm.teachingYear}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                                        <input
                                            type="number"
                                            name="totalAmount"
                                            value={editForm.totalAmount}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Institute Cut (%)</label>
                                        <input
                                            type="number"
                                            name="instituteCut"
                                            value={editForm.instituteCut}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleUpdate(salary._id)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-indigo-800">{salary.teacherName}</h3>
                                        <p className="text-gray-600">{salary.teachingSubject}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Year: {salary.teachingYear}</p>
                                        <p className="text-gray-600">Total: LKR {salary.totalAmount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Cut: {salary.instituteCut}%</p>
                                        <p className="text-xl font-bold text-green-600">
                                            Final: LKR {salary.calculatedSalary.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => handleEdit(salary)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(salary._id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SalaryRecords; 