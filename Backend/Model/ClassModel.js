const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    schedule: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    room: {
        type: String
    },
    description: {
        type: String
    },
    mcqs: [{
        question: {
            type: String,
            required: true
        },
        correctAnswer: {
            type: Number,
            required: true,
            min: 0,
            max: 3
        },
        options: [{
            type: String,
            required: true
        }]
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Class', classSchema); 