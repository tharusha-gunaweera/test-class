const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    teacherName: {
        type: String,
        required: true
    },
    teachingSubject: {
        type: String,
        required: true
    },
    teachingYear: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    instituteCut: {
        type: Number,
        required: true
    },
    calculatedSalary: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Salary', salarySchema); 