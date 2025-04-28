const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    redFlagCount: {
        type: Number,
        default: 0
    },
    orangeFlagCount: {
        type: Number,
        default: 0
    },
    greenFlagCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema); 