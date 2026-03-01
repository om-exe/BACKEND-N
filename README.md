# Nirvana Backend API

RESTful API for the Nirvana plant monitoring system, built with Node.js, Express, and MongoDB.

## Features

- 🔐 **JWT Authentication**: Secure token-based auth
- 🌐 **Google OAuth**: Social login support
- 📊 **Sensor Data API**: Store and retrieve ESP32 sensor readings
- 🗄️ **MongoDB**: Flexible NoSQL database
- 🔒 **Security**: Helmet, CORS, input validation
- 📈 **Statistics**: Aggregate sensor data analytics

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nirvana
JWT_SECRET=your-secure-random-secret-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Running MongoDB

**Local MongoDB:**
```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt update
sudo apt install mongodb

# Start MongoDB
sudo systemctl start mongodb
```

**MongoDB Atlas (Cloud):**
1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas/database)
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `.env`

### Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on http://localhost:5000

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Google OAuth
```http
POST /api/auth/google
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "googleId": "google-user-id"
}
```

### Sensor Data

All sensor endpoints require authentication header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get Sensor Data
```http
GET /api/sensors?limit=50&deviceId=ESP32-001
```

#### Add Sensor Reading (ESP32)
```http
POST /api/sensors
Content-Type: application/json
Authorization: Bearer <token>

{
  "soilMoisture": 45.5,
  "temperature": 24.3,
  "humidity": 65.2,
  "relayStatus": false,
  "deviceId": "ESP32-001"
}
```

#### Get Latest Reading
```http
GET /api/sensors/latest?deviceId=ESP32-001
```

#### Get Statistics
```http
GET /api/sensors/stats?days=7&deviceId=ESP32-001
```

## ESP32 Integration

### MicroPython Example

```python
import urequests
import ujson
import machine
import dht
from time import sleep

# Configuration
API_URL = "http://your-server-ip:5000/api"
JWT_TOKEN = "your-jwt-token-here"

# Sensors
dht_sensor = dht.DHT11(machine.Pin(4))
soil_pin = machine.ADC(machine.Pin(34))
relay = machine.Pin(2, machine.Pin.OUT)

def read_soil_moisture():
    raw_value = soil_pin.read()
    # Convert to percentage (calibrate these values)
    moisture = 100 - ((raw_value / 4095) * 100)
    return round(moisture, 1)

def send_sensor_data():
    try:
        # Read sensors
        dht_sensor.measure()
        temp = dht_sensor.temperature()
        humidity = dht_sensor.humidity()
        soil = read_soil_moisture()
        
        # Prepare data
        data = {
            "soilMoisture": soil,
            "temperature": temp,
            "humidity": humidity,
            "relayStatus": relay.value() == 1,
            "deviceId": "ESP32-001"
        }
        
        # Send to API
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {JWT_TOKEN}"
        }
        
        response = urequests.post(
            f"{API_URL}/sensors",
            json=data,
            headers=headers
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        response.close()
        
        # Auto-control relay based on soil moisture
        if soil < 30:
            relay.on()
        elif soil > 70:
            relay.off()
            
    except Exception as e:
        print(f"Error: {e}")

# Main loop
while True:
    send_sensor_data()
    sleep(60)  # Send data every 60 seconds
```

### Getting JWT Token for ESP32

1. Login via API or frontend
2. Copy the JWT token from response
3. Add to ESP32 code or use a device-specific token endpoint

## Database Schema

### Users
```javascript
{
  email: String,
  password: String (hashed),
  name: String,
  googleId: String,
  createdAt: Date
}
```

### SensorData
```javascript
{
  userId: ObjectId,
  deviceId: String,
  soilMoisture: Number (0-100),
  temperature: Number,
  humidity: Number (0-100),
  relayStatus: Boolean,
  timestamp: Date
}
```

## Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Input validation on all endpoints
- CORS protection
- Helmet security headers
- Rate limiting ready

## License

MIT
