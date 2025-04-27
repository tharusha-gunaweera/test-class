import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import axios from 'axios'

function Payments() {
  const [payments, setPayments] = useState([])
  const [editingPayment, setEditingPayment] = useState(null)
  const [editForm, setEditForm] = useState({
    studentName: '',
    studentId: '',
    studyingYear: '',
    courseName: '',
    paymentMonth: '',
    amount: ''
  })
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/payments')
      setPayments(response.data)
    } catch (error) {
      console.error('Error fetching payments:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/payments/${id}`)
      fetchPayments() // Refresh the list
    } catch (error) {
      console.error('Error deleting payment:', error)
    }
  }

  const handleEdit = (payment) => {
    setEditingPayment(payment._id)
    setEditForm({
      studentName: payment.studentName,
      studentId: payment.studentId,
      studyingYear: payment.studyingYear,
      courseName: payment.courseName,
      paymentMonth: payment.paymentMonth,
      amount: payment.amount
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:5000/payments/${editingPayment}`, editForm)
      setEditingPayment(null)
      fetchPayments() // Refresh the list
    } catch (error) {
      console.error('Error updating payment:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pl-72 w-full max-w-full px-4 py-8 overflow-x-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-800">Student Payments Management</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by student name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-indigo-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments
                .filter(payment => payment.studentName.toLowerCase().includes(search.toLowerCase()))
                .map((payment) => (
                  <tr key={payment._id}>
                    {editingPayment === payment._id ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="studentName"
                            value={editForm.studentName}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="studentId"
                            value={editForm.studentId}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="studyingYear"
                            value={editForm.studyingYear}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="courseName"
                            value={editForm.courseName}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="paymentMonth"
                            value={editForm.paymentMonth}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="amount"
                            value={editForm.amount}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={handleEditSubmit}
                            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPayment(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">{payment.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{payment.studentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{payment.studyingYear}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{payment.courseName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{payment.paymentMonth}</td>
                        <td className="px-6 py-4 whitespace-nowrap">LKR.{payment.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(payment)}
                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(payment._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Payments
