import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const SalaryForm = () => {
    const [formData, setFormData] = useState({
        teacherName: '',
        teachingSubject: '',
        teachingYear: '',
        totalAmount: '',
        instituteCut: '',
        bankName: '',
        accountNumber: ''
    });
    const [calculatedSalary, setCalculatedSalary] = useState(null);
    const [error, setError] = useState('');
    const [nameError, setNameError] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [amountError, setAmountError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'teacherName') {
            if (/^[a-zA-Z\s]*$/.test(value)) {
                setNameError('');
                setFormData({
                    ...formData,
                    [name]: value
                });
            } else {
                setNameError('Teacher name can only contain letters and spaces');
            }
        } else if (name === 'teachingSubject') {
            if (/^[a-zA-Z\s]*$/.test(value)) {
                setSubjectError('');
                setFormData({
                    ...formData,
                    [name]: value
                });
            } else {
                setSubjectError('Subject can only contain letters and spaces');
            }
        } else if (name === 'totalAmount') {
            if (/^\d*\.?\d*$/.test(value)) {
                setAmountError('');
                setFormData({
                    ...formData,
                    [name]: value
                });
            } else {
                setAmountError('Total amount can only contain numbers and one decimal point');
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nameError || subjectError || amountError) {
            setError('Please fix the validation errors before submitting');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/salary/calculate', {
                ...formData,
                teachingYear: parseInt(formData.teachingYear),
                totalAmount: parseFloat(formData.totalAmount),
                instituteCut: parseFloat(formData.instituteCut)
            });
            setCalculatedSalary(response.data);
            setError('');
        } catch (err) {
            setError('Error calculating salary. Please try again.');
            console.error(err);
        }
    };

    const handleViewRecords = () => {
        navigate('/salary-records');
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg">
            <Navbar/>
            <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">Teacher Salary Calculator</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
                        <input
                            type="text"
                            name="teacherName"
                            value={formData.teacherName}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-2 border ${nameError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                            placeholder="Enter teacher's name"
                        />
                        {nameError && (
                            <p className="mt-1 text-sm text-red-600">{nameError}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teaching Subject</label>
                        <input
                            type="text"
                            name="teachingSubject"
                            value={formData.teachingSubject}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-2 border ${subjectError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                            placeholder="Enter subject"
                        />
                        {subjectError && (
                            <p className="mt-1 text-sm text-red-600">{subjectError}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teaching Year</label>
                        <input
                            type="number"
                            name="teachingYear"
                            value={formData.teachingYear}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                            placeholder="Enter year"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (LKR)</label>
                        <input
                            type="text"
                            name="totalAmount"
                            value={formData.totalAmount}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-2 border ${amountError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                            placeholder="Enter total amount"
                        />
                        {amountError && (
                            <p className="mt-1 text-sm text-red-600">{amountError}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institute Cut (%)</label>
                        <input
                            type="number"
                            name="instituteCut"
                            value={formData.instituteCut}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                            placeholder="Enter institute cut percentage"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                        <select
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        >
                            <option value="">Select a bank</option>
                            <option value="Bank of Ceylon">Bank of Ceylon</option>
                            <option value="Sampath Bank">Sampath Bank</option>
                            <option value="Commercial Bank">Commercial Bank</option>
                            <option value="HNB">HNB</option>
                            <option value="Peoples Bank">People's Bank</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                            placeholder="Enter account number"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 transform hover:scale-105"
                >
                    Calculate Salary
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                    {error}
                </div>
            )}

            {calculatedSalary && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-md border border-green-200">
                    <h3 className="text-xl font-semibold text-center text-green-800 mb-4">Salary Calculation Results</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                            <span className="text-gray-600">Teacher Name:</span>
                            <span className="font-medium">{calculatedSalary.teacherName}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-medium">LKR {calculatedSalary.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                            <span className="text-gray-600">Institute Cut:</span>
                            <span className="font-medium">{calculatedSalary.instituteCut}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                            <span className="text-gray-600">Cut Amount:</span>
                            <span className="font-medium text-red-600">
                                LKR {(calculatedSalary.totalAmount * (calculatedSalary.instituteCut / 100)).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                            <span className="text-gray-600">Final Salary:</span>
                            <span className="font-bold text-green-600 text-xl">
                                LKR {calculatedSalary.calculatedSalary.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleViewRecords}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 transform hover:scale-105"
                >
                    View Salary Records
                </button>
            </div>
        </div>
    );
};

export default SalaryForm; 