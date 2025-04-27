const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
    date: {
        type: Number,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Advertisement', advertisementSchema); 