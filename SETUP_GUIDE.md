# Personal Cloud Storage System - Complete Setup Guide

## 🎯 Overview

A secure, multi-user cloud storage system with file management, user authentication (JWT), MongoDB database, and network access via IP.

**Access URLs:**

- Local: `http://localhost:5000`
- Network IP: `http://192.168.x.x:5000` (displayed when server starts)

---

## 📋 Prerequisites

Install before starting:

- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **MongoDB** (Local or Atlas Cloud) - [Setup Guide](#mongodb-setup)
- **Git** (Optional) - For version control

---

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Cloud - RECOMMENDED)

**Why Atlas?** No installation needed, always available, free tier available.

#### Step-by-Step Setup:

1. **Create Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Create account with email

2. **Create Cluster**
   - Choose "FREE" tier
   - Select any cloud provider (AWS/Azure/Google)
   - Choose region closest to you
   - Click "Create Cluster" (takes 5-10 minutes)

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Authentication Method: "Password"
   - Username: `clouduser` (or your choice)
   - Password: Choose strong password
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string

6. **Update .env File**
   ```env
   MONGO_URI=mongodb+srv://clouduser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cloudstorage?retryWrites=true&w=majority
   ```
   Replace `YOUR_PASSWORD` with your actual password.

**✅ Your .env is already configured for Atlas!**

---

### Option 2: Local MongoDB (Alternative)

#### Windows Installation:

1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer, follow defaults
3. MongoDB will auto-start as a service
4. Verify connection:
   ```bash
   mongosh
   ```

#### Use Connection String:

```
mongodb://127.0.0.1:27017/cloudstorage
```

---

## ⚙️ Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

**Packages Installed:**

- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- multer - File upload handling
- cors - Cross-Origin requests
- express-validator - Input validation

### 2. Configure Environment (Optional - Already Set)

File: `server/.env`

```env
MONGO_URI=mongodb://127.0.0.1:27017/cloudstorage
PORT=5000
NODE_ENV=development
JWT_SECRET=dev_secret_key_123456789
MAX_FILE_SIZE=52428800  # 50MB
```

**To use different config**, edit `.env` before starting server.

### 3. Start Backend Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

**Expected Output:**

```
========================================
Server running successfully!
Local Access: http://localhost:5000
Network Access: http://192.168.1.100:5000
========================================
```

---

## 🌐 Frontend Access

### Via Browser:

1. **Local Machine:**
   - http://localhost:5000

2. **Other Devices on Network:**
   - http://192.168.x.x:5000 (Replace with your server's IP)
   - Example: http://192.168.1.100:5000

### Get Your Server IP:

When server starts, it displays the network IP. Or find it:

- **Windows PowerShell:**
  ```powershell
  ipconfig
  # Look for IPv4 Address under your network adapter
  ```

---

## 🔐 Core Features

### User Authentication

- **Register** with username, email address, password (6+ chars)
- **Login** with email & password
- **JWT Token** stored in localStorage (7-day expiration)
- **Automatic logout** if token expires

### File Management

- **Upload** multiple files (50MB max)
- **Auto-organize** by type: images, videos, documents, others
- **Further organized** by userId: `/uploads/{type}/{userId}/`
- **Unique filenames**: `{timestamp}_{randomString}_{originalName}`
  - Example: `1712345678_abcd1234_photo.jpg`

### File Operations

- **View** with previews (images, videos, PDFs)
- **Download** files
- **Delete** files (permanent)
- **Search** by filename
- **Filter** by file type
- **Sort** by date or size

### Security

- Password hashing (bcrypt)
- JWT authorization on all file endpoints
- User-level file isolation (can only access own files)
- Input validation (email, username, password rules)
- File type restrictions (prevents unsafe uploads)

---

## 📊 API Endpoints

### Authentication

**POST** `/api/auth/register`

```json
{
  "username": "john123",
  "email": "john@gmail.com",
  "password": "securepass123"
}
```

Response: `{ token, message, user }`

**POST** `/api/auth/login`

```json
{
  "email": "john@gmail.com",
  "password": "securepass123"
}
```

Response: `{ token, message, user }`

### Files

**GET** `/api/files` (Requires: `Authorization: Bearer {token}`)

- Returns all files for logged-in user

**POST** `/api/files/upload` (Requires: Bearer token + FormData)

- Upload a file
- Auto-categorized by type
- Auto-created user folder

**GET** `/api/files/download/:id` (Requires: Bearer token)

- Downloads the file

**DELETE** `/api/files/:id` (Requires: Bearer token)

- Permanently deletes file

---

## 💻 Frontend Integration

### Login/Register Page

- Form validation (client-side)
- JWT token saved to localStorage
- Redirects to dashboard after auth

### Dashboard

- **Upload Section**: Drag-drop or select files
- **Progress Bar**: Shows upload %
- **Search Bar**: Filter files by name
- **Type Filter**: Images, Videos, Documents, Others
- **Sort Options**: By date or size
- **Dark Mode**: Toggle theme
- **File Actions**: Download, Delete

### JWT Token Handling

```javascript
// Automatic token attachment to requests
const token = localStorage.getItem("token");
headers.Authorization = `Bearer ${token}`;

// Token expires: 7 days
// Stored in: localStorage
```

---

## 📁 Project Structure

```
personal-cloud-storage/
├── server/
│   ├── config/
│   │   └── database.js          (MongoDB connection)
│   ├── controllers/
│   │   ├── authController.js    (Login/Register logic)
│   │   └── fileController.js    (Upload/Download/Delete)
│   ├── middleware/
│   │   ├── auth.js              (JWT verification)
│   │   └── upload.js            (Multer file handling)
│   ├── models/
│   │   ├── User.js              (User schema)
│   │   └── File.js              (File schema)
│   ├── routes/
│   │   ├── auth.js              (Auth endpoints)
│   │   └── files.js             (File endpoints)
│   ├── uploads/                 (Organized file storage)
│   │   ├── images/{userId}/
│   │   ├── videos/{userId}/
│   │   ├── documents/{userId}/
│   │   └── others/{userId}/
│   ├── server.js                (Main app entry)
│   ├── package.json
│   ├── .env                     (Configuration)
│   └── .env.example             (Template)
│
├── client/
│   ├── index.html               (Main page)
│   ├── css/
│   │   └── styles.css           (Styling)
│   └── js/
│       ├── api.js               (Fetch API calls)
│       ├── auth.js              (Auth logic)
│       └── dashboard.js         (File management)
│
└── README.md                    (This file)
```

---

## 🚀 Testing the System

### 1. Register a New User

```
1. Open http://localhost:5000
2. Click "Register"
3. Fill form:
   - Username: testuser123
   - Email: testuser@gmail.com
   - Password: mypass123
4. Click "Register"
5. Auto-redirects to Dashboard
```

### 2. Upload Files

```
1. Click "Upload Files"
2. Select files (or drag-drop)
3. Watch progress bar
4. Files appear in dashboard
5. Organized by type automatically
```

### 3. Download Files

```
1. Click "Download" on any file
2. File downloads to computer
```

### 4. Delete Files

```
1. Click "Delete" on any file
2. Confirm deletion
3. File removed from storage
```

### 5. Search & Filter

```
1. Type in "Search files..." box
2. Results filter in real-time
3. Use "All Types" dropdown to filter by category
4. Use sort options for different ordering
```

---

## 🔧 Advanced Configuration

### Change JWT Expiration

Edit `server/controllers/authController.js`:

```javascript
{
  expiresIn: "7d";
} // Change to '24h', '30d', etc.
```

### Change File Size Limit

Edit `server/middleware/upload.js`:

```javascript
limits: {
  fileSize: 100 * 1024 * 1024, // 100MB instead of 50MB
}
```

### Add/Remove File Types

Edit `server/middleware/upload.js`:

```javascript
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "video/mp4",
  "application/pdf",
  // Add new MIME types here
];
```

---

## 🐛 Troubleshooting

### Port 5000 Already in Use

```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000
# Kill process (replace PID)
taskkill /PID <PID> /F
```

### MongoDB Connection Failed

```
1. Check MongoDB is running:
   - Windows: Services → MongoDB → Running
   - Command: mongosh
2. Verify connection string in .env
3. Check firewall settings
```

### CORS Errors

```
1. Frontend and backend must be accessible from same network
2. Check server CORS settings in server.js
3. Use correct IP address (not localhost if accessing from another device)
```

### Uploads Not Working

```
1. Check file size < 50MB
2. Check file type is allowed
3. Verify token in localStorage
4. Check /server/uploads/ folder has write permissions
```

### Files Not Appearing

```
1. Refresh page
2. Check browser console for errors
3. Check server console for MongoDB errors
4. Verify user is logged in
```

---

## 🔒 Security Notes

1. **Change JWT_SECRET in production:**
   - Currently: `dev_secret_key_123456789`
   - Use: `crypto.randomBytes(64).toString('hex')`

2. **HTTPS for Production:**
   - Use SSL certificates
   - Configure in express server

3. **Database Backups:**
   - Regular MongoDB backups
   - Automated scripts recommended

4. **File Validation:**
   - Server-side MIME type checking enabled
   - Client-side validation recommended

---

## 📝 Validation Rules

### Username:

- Letters and numbers only
- No special characters
- Unique in database

### Email:

- Format: `name@gmail.com`
- Must be valid Gmail address
- Unique in database

### Password:

- Minimum 6 characters
- Case-sensitive
- Hashed with bcrypt (10 rounds)

### Files:

- Max size: 50MB (configurable)
- Allowed types: Images, Videos, Documents, Others
- Auto-detected by MIME type

---

## 📞 Support & Debugging

### Enable Debug Logging

```bash
# Terminal
set DEBUG=* && npm start  # Windows
DEBUG=* npm start         # Mac/Linux
```

### Check Logs:

- Browser Console (F12)
- Server Terminal Output
- MongoDB Logs

---

## ✨ Future Enhancements

- [ ] File sharing with links
- [ ] Folder organization
- [ ] Bulk operations
- [ ] File versioning
- [ ] Activity logs
- [ ] Storage quota per user
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] File encryption

---

## 📄 License & Disclaimer

This is a personal project. Use at your own discretion.

**Enjoy your personal cloud storage!** ☁️
