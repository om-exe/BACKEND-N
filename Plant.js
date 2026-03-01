const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Plant name is required'],
        trim: true,
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
    },
    deviceId: {
        type: String,
        required: [true, 'ESP32 Device ID is required'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index to ensure deviceId is unique per user
plantSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

module.exports = mongoose.model('Plant', plantSchema);