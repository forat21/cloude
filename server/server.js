const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const os = require('os');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const { connectDB } = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration for network access
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // Allow localhost and 127.0.0.1 on any port
    // Allow any IP address on port 5000
    if (!origin || 
        origin.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/) ||
        origin.match(/^https?:\/\/(\d+\.\d+\.\d+\.\d+):5000$/)) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all for development
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add headers for network access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  const networkIPs = getNetworkIPs();
  console.log(`\n========================================`);
  console.log(`Server running successfully!`);
  console.log(`Local Access: http://localhost:${PORT}`);
  if (networkIPs.length > 0) {
    networkIPs.forEach(ip => console.log(`Network Access: http://${ip}:${PORT}`));
  } else {
    console.log(`Network Access: http://127.0.0.1:${PORT}`);
  }
  console.log(`========================================\n`);
});

function getNetworkIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}