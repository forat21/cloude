@echo off
REM Personal Cloud Storage - Quick Start Script

echo.
echo ========================================
echo Personal Cloud Storage System
echo Quick Start Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed: 
node --version

REM Navigate to server directory
cd server

REM Check if node_modules exists
if not exist "node_modules" (
    echo.
    echo [INSTALLING] Dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies already installed
)

REM Check MongoDB connection
echo.
echo [CHECKING] MongoDB Atlas Connection...
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGO_URI).then(() => { console.log('[OK] MongoDB Atlas is connected'); process.exit(0); }).catch((err) => { console.log('[ERROR] MongoDB Atlas connection failed'); console.log('Please check your MONGO_URI in .env file'); console.log('Make sure your Atlas cluster is running and credentials are correct'); process.exit(1); })"

REM Start the server
echo.
echo [STARTING] Server...
echo.
call npm start

pause
