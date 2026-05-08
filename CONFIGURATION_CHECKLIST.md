# Configuration Checklist - Personal Cloud Storage

Use this checklist to verify all components are properly configured.

## ✅ Prerequisites

- [ ] Node.js v14+ installed
- [ ] npm available in command line
- [ ] MongoDB installed/running (local or Atlas account created)

## ✅ MongoDB Setup

### Local MongoDB

- [ ] MongoDB Community Server downloaded and installed
- [ ] MongoDB service running (Windows: Services, Mac/Linux: mongosh connects)
- [ ] Connection string verified: `mongodb://127.0.0.1:27017/cloudstorage`

### MongoDB Atlas (Cloud)

- [ ] MongoDB Atlas account created
- [ ] Free cluster created
- [ ] Database user created (username + password)
- [ ] IP address whitelisted in Network Access
- [ ] Connection string copied and accurate

## ✅ Backend Configuration

### Environment File (.env)

- [ ] File exists: `server/.env`
- [ ] MONGO_URI is correct:
  - [ ] Local: `mongodb://127.0.0.1:27017/cloudstorage`
  - [ ] Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/cloudstorage`
- [ ] PORT is set to `5000`
- [ ] NODE_ENV set to `development`
- [ ] JWT_SECRET configured (can be default for dev)
- [ ] MAX_FILE_SIZE set to `52428800` (50MB)

### Dependencies Installed

- [ ] `npm install` run from `server/` folder
- [ ] `node_modules` folder created
- [ ] `package-lock.json` generated

### Server Verification

- [ ] `server.js` exists and contains CORS config
- [ ] CORS listening on `0.0.0.0` (all interfaces)
- [ ] PORT 5000 configured
- [ ] Upload middleware configured
- [ ] MongoDB connection tested

## ✅ Database Models

### User Model

- [ ] `server/models/User.js` exists
- [ ] Schema includes: username, email, password, createdAt
- [ ] Validation: email, username uniqueness
- [ ] Password validation: minlength 6

### File Model

- [ ] `server/models/File.js` exists
- [ ] Schema includes: originalName, storedName, filePath, fileType, fileSize, userId, uploadDate
- [ ] userId references User collection
- [ ] Proper indexing for queries

## ✅ API Routes & Controllers

### Auth Routes

- [ ] `server/routes/auth.js` exists
- [ ] POST `/auth/register` endpoint configured
- [ ] POST `/auth/login` endpoint configured
- [ ] Input validation enabled

### Auth Controller

- [ ] `server/controllers/authController.js` exists
- [ ] register() function validates username, email, password
- [ ] Password hashing with bcryptjs
- [ ] JWT token generation
- [ ] 7-day token expiration
- [ ] Proper error responses

### File Routes

- [ ] `server/routes/files.js` exists
- [ ] GET `/files` with auth middleware
- [ ] POST `/files/upload` with auth and upload middleware
- [ ] GET `/files/download/:id` with auth middleware
- [ ] DELETE `/files/:id` with auth middleware

### File Controller

- [ ] `server/controllers/fileController.js` exists
- [ ] getFiles() filters by userId
- [ ] uploadFile() creates unique filenames
- [ ] uploadFile() stores metadata in MongoDB
- [ ] downloadFile() verifies ownership
- [ ] deleteFile() removes file and metadata

## ✅ Middleware

### Auth Middleware

- [ ] `server/middleware/auth.js` exists
- [ ] Extracts JWT from Authorization header
- [ ] Verifies token signature
- [ ] Attaches user to req.user
- [ ] Returns 401 if no/invalid token

### Upload Middleware

- [ ] `server/middleware/upload.js` exists
- [ ] Multer configured with disk storage
- [ ] File type whitelist defined
- [ ] 50MB file size limit set
- [ ] Directory creation: /uploads/{type}/{userId}/
- [ ] Unique filename generation: {timestamp}_{randomString}_{originalName}

## ✅ Frontend Configuration

### HTML Structure

- [ ] `client/index.html` exists
- [ ] Login form: email, password fields
- [ ] Register form: username, email, password fields
- [ ] Dashboard: file list, upload, search, filter
- [ ] Script imports: api.js, auth.js, dashboard.js

### API Client

- [ ] `client/js/api.js` exists
- [ ] API_BASE URL set to `http://{window.location.hostname}:5000/api`
- [ ] register() method implemented
- [ ] login() method implemented
- [ ] getFiles() method implemented
- [ ] uploadFile() with progress tracking
- [ ] downloadFile() method implemented
- [ ] deleteFile() method implemented
- [ ] Token handling: localStorage get/set

### Auth Logic

- [ ] `client/js/auth.js` exists
- [ ] Token check on page load
- [ ] Register form submission handling
- [ ] Login form submission handling
- [ ] Logout functionality
- [ ] Form switching (login ↔ register)
- [ ] showDashboard() and showAuth() functions
- [ ] Notification system

### Dashboard

- [ ] `client/js/dashboard.js` exists
- [ ] loadFiles() fetches from API
- [ ] renderFiles() displays file list
- [ ] uploadFiles() handles file selection and upload
- [ ] downloadFile() handler
- [ ] deleteFile() handler with confirmation
- [ ] Search functionality (filterFiles)
- [ ] Filter by type functionality
- [ ] Sort options (date, size)
- [ ] Dark mode toggle
- [ ] File preview: images, videos, PDFs

### Styling

- [ ] `client/css/styles.css` exists
- [ ] Responsive design (mobile/desktop)
- [ ] Auth form styling
- [ ] Dashboard styling
- [ ] File item cards
- [ ] Buttons and inputs styled
- [ ] Dark mode CSS
- [ ] Notification styling

## ✅ File Organization

### Upload Directory Structure

- [ ] `/server/uploads/` folder created
- [ ] `/server/uploads/images/` subfolder
- [ ] `/server/uploads/videos/` subfolder
- [ ] `/server/uploads/documents/` subfolder
- [ ] `/server/uploads/others/` subfolder
- [ ] User folders auto-created: `/uploads/{type}/{userId}/`

## ✅ Network Access

### Server Configuration

- [ ] Listening on `0.0.0.0` (all interfaces)
- [ ] Port 5000 not blocked by firewall
- [ ] CORS configured for network access
- [ ] Server IP printed on startup

### Frontend Access

- [ ] Localhost access works: `http://localhost:5000`
- [ ] Network IP access works: `http://192.168.x.x:5000`
- [ ] Assets load correctly from network IP
- [ ] API calls work from network IP

## ✅ Testing Verification

### Register Test

- [ ] Can register new user with valid data
- [ ] Username validation: rejects special characters
- [ ] Email validation: rejects non-@gmail.com
- [ ] Password validation: rejects <6 chars
- [ ] Token received and stored in localStorage
- [ ] Redirects to dashboard after registration

### Login Test

- [ ] Can login with correct credentials
- [ ] Rejects invalid credentials
- [ ] Token stored in localStorage
- [ ] Redirects to dashboard after login

### Upload Test

- [ ] Can select files for upload
- [ ] Progress bar shows during upload
- [ ] File appears in file list after upload
- [ ] File stored in correct directory (/uploads/{type}/{userId}/)
- [ ] File metadata stored in MongoDB

### Download Test

- [ ] Can download uploaded file
- [ ] Downloaded file is not corrupted
- [ ] Correct filename in download

### Delete Test

- [ ] Can delete file with confirmation
- [ ] File removed from dashboard
- [ ] File removed from filesystem
- [ ] File metadata removed from MongoDB

### Search & Filter Test

- [ ] Search filters files by name
- [ ] Type filter works (Images, Videos, Documents, Others)
- [ ] Sort by date works (newest/oldest first)
- [ ] Sort by size works (largest/smallest first)

### Security Test

- [ ] Cannot access files without login
- [ ] Cannot access other user's files
- [ ] Logout clears token from localStorage
- [ ] Expired token redirects to login

## ✅ Security Verification

### Password Security

- [ ] Passwords are hashed with bcrypt
- [ ] Hashed passwords stored in MongoDB (not plain text)
- [ ] Salt rounds set to 10

### JWT Security

- [ ] Token expires after 7 days
- [ ] Token contains user ID and username
- [ ] Token verified on protected endpoints
- [ ] Invalid tokens rejected

### File Security

- [ ] Files stored with unique names (no overwrites)
- [ ] Only file owner can download/delete
- [ ] File type validation prevents unsafe uploads
- [ ] File size limit enforced

## ✅ Error Handling

### Server Errors

- [ ] Server captures and logs errors
- [ ] 400 errors for bad requests
- [ ] 401 errors for authorization failures
- [ ] 404 errors for not found
- [ ] 500 errors for server issues
- [ ] Error messages sent to client

### Client Errors

- [ ] Validation errors shown to user
- [ ] Network errors handled gracefully
- [ ] File upload errors shown
- [ ] File download errors shown
- [ ] Notification system displays all errors

## ✅ Performance

### Upload Performance

- [ ] Progress bar updates in real-time
- [ ] Multiple file upload supported
- [ ] Large files (up to 50MB) supported
- [ ] Upload doesn't block UI

### File List Performance

- [ ] Dashboard loads file list quickly
- [ ] Search filters in real-time
- [ ] Sorting is instant
- [ ] File previews load efficiently

## 🚀 Pre-Launch Checklist

Before considering the system ready:

- [ ] All sections above are checked
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Frontend loads at http://localhost:5000
- [ ] Can register → login → upload → download → delete
- [ ] All features working as expected
- [ ] No console errors or warnings
- [ ] Responsive on mobile devices
- [ ] Dark mode functional
- [ ] Network access working

## 📝 Notes

- **Production Changes**: Before deployment, change JWT_SECRET and enable HTTPS
- **MongoDB**: Ensure regular backups scheduled
- **Monitoring**: Set up error logging and monitoring
- **Scaling**: Consider database optimization for large file storage

---

✅ **When all checkboxes are complete, the system is ready to use!**
