#!/bin/bash
# Personal Cloud Storage - Quick Start Script for Mac/Linux

echo ""
echo "========================================"
echo "Personal Cloud Storage System"
echo "Quick Start Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[OK] Node.js is installed:"
node --version

# Navigate to server directory
cd server

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo "[INSTALLING] Dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] npm install failed"
        exit 1
    fi
    echo "[OK] Dependencies installed"
else
    echo "[OK] Dependencies already installed"
fi

# Check MongoDB connection
echo ""
echo "[CHECKING] MongoDB Connection..."
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cloudstorage').then(() => { console.log('[OK] MongoDB is connected'); process.exit(0); }).catch((err) => { console.log('[WARNING] MongoDB connection failed - ensure MongoDB is running'); console.log('See SETUP_GUIDE.md for MongoDB setup'); process.exit(0); })" 2>/dev/null

# Start the server
echo ""
echo "[STARTING] Server..."
echo ""
npm start
