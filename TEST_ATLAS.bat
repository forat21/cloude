@echo off
REM MongoDB Atlas Connection Test Script

echo.
echo ========================================
echo MongoDB Atlas Connection Test
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

echo [OK] Node.js is installed

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
)

echo.
echo [TESTING] MongoDB Atlas Connection...
echo.

node -e "
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Connecting to MongoDB Atlas...');
console.log('Connection String:', process.env.MONGO_URI.replace(/:([^:@]{4})[^:@]*@/, ':****@'));

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ SUCCESS: MongoDB Atlas connected successfully!');
  console.log('Your cloud database is ready.');
  process.exit(0);
})
.catch((err) => {
  console.log('❌ FAILED: MongoDB Atlas connection failed');
  console.log('Error:', err.message);
  console.log('');
  console.log('Troubleshooting:');
  console.log('1. Check your MONGO_URI in .env file');
  console.log('2. Make sure your Atlas cluster is running');
  console.log('3. Verify database user credentials');
  console.log('4. Check Network Access settings in Atlas');
  console.log('5. Wait a few minutes if cluster was just created');
  process.exit(1);
})
"

pause