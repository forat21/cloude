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

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://cloude-production-c26c.up.railway.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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