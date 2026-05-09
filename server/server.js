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

// Serve static files from client folder (for production deployment)
app.use(express.static(path.join(__dirname, '../client')));

// Catch all handler: send back index.html for any non-API routes
app.get('*', (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  } else {
    res.status(404).json({ message: 'API endpoint not found' });
  }
});

const initialPort = parseInt(process.env.PORT, 10) || 5000;
const HOST = '0.0.0.0';

function startServer(port) {
  const server = app.listen(port, HOST, () => {
    const networkIPs = getNetworkIPs();
    console.log(`\n========================================`);
    console.log(`Server running successfully!`);
    console.log(`Local Access: http://localhost:${port}`);
    if (networkIPs.length > 0) {
      networkIPs.forEach(ip => console.log(`Network Access: http://${ip}:${port}`));
    } else {
      console.log(`Network Access: http://127.0.0.1:${port}`);
    }
    console.log(`========================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (port === initialPort) {
        console.warn(`Port ${port} is already in use. Trying port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error(`Port ${port} is already in use. Please stop the process or set a different PORT.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer(initialPort);

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