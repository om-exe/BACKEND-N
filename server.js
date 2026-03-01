const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./auth');

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Body:', JSON.stringify(req.body).substring(0, 200));
    }
    next();
});

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ Mongo Error:", err));

// ===== Routes =====
app.use('/api/auth', authRoutes);

// ===== Test Route =====
app.get('/', (req, res) => {
    res.send("🚀 Nirvara Backend Server Running Successfully!");
});

// ===== 404 Handler =====
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
