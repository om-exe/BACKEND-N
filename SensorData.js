const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deviceId: {
        type: String,
        default: 'ESP32-001',
    },
    soilMoisture: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    temperature: {
        type: Number,
        required: true,
    },
    humidity: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    relayStatus: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Index for faster queries
sensorDataSchema.index({ userId: 1, timestamp: -1 });
sensorDataSchema.index({ deviceId: 1 });

module.exports = mongoose.model('SensorData', sensorDataSchema);
