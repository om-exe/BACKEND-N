const http = require('http');

/**
 * ESP32 Simulation Script for Nirvana
 * 
 * This script simulates an ESP32 device sending data to the backend.
 * It uses the /api/iot endpoint which is designed for IoT devices.
 */

// CONFIGURATION
const API_HOST = 'localhost';
const API_PORT = 5000;
const USER_EMAIL = 'omjangam041@gmail.com'; // Change this to your registered email
const INTERVAL_MS = 5000;              // Send every 5 seconds

console.log('🌱 Nirvana ESP32 Simulator Started');
console.log(`📡 Sending data to http://${API_HOST}:${API_PORT}/api/iot every ${INTERVAL_MS / 1000}s`);
console.log(`👤 Simulating for user: ${USER_EMAIL}`);
console.log('---');

function sendData() {
    // Generate some realistic-looking random sensor data
    const data = JSON.stringify({
        temperature: (20 + Math.random() * 10).toFixed(1),
        humidity: (40 + Math.random() * 20).toFixed(1),
        soil: (30 + Math.random() * 40).toFixed(1),
        health: (80 + Math.random() * 20).toFixed(1),
        pump: Math.random() > 0.8 ? 'ON' : 'OFF',
        userEmail: USER_EMAIL,
        deviceKey: 'SIMULATED-ESP32'
    });

    const options = {
        hostname: API_HOST,
        port: API_PORT,
        path: '/api/iot',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            if (res.statusCode === 201) {
                const parsed = JSON.parse(body);
                console.log(`✅ [${new Date().toLocaleTimeString()}] Data sent: Soil=${parsed.data.soil}% Temp=${parsed.data.temperature}°C`);
            } else {
                console.log(`❌ [${new Date().toLocaleTimeString()}] Error ${res.statusCode}: ${body}`);
            }
        });
    });

    req.on('error', (error) => {
        console.error(`❌ Connection error: ${error.message}`);
        console.log('💡 Make sure your backend server is running (npm run dev)');
    });

    req.write(data);
    req.end();
}

// Send first reading immediately
sendData();

// Then send at intervals
setInterval(sendData, INTERVAL_MS);
