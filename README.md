# Personal Cloud Storage System

A secure, multi-user cloud storage platform similar to Google Drive. Store, organize, and access files over a local network with user authentication, file management, and MongoDB database integration.

## 🎯 Features

### Core Functionality

- ✅ **User Authentication**: Register & login with JWT tokens (7-day expiration)
- ✅ **File Management**: Upload, download, delete, preview files
- ✅ **Auto-Organization**: Files categorized by type (images, videos, documents, others)
- ✅ **Search & Filter**: Find files by name or type
- ✅ **Sorting**: Order by date or file size
- ✅ **Progress Tracking**: Upload progress indicator
- ✅ **Dark Mode**: Toggle dark/light theme
- ✅ **Responsive UI**: Works on desktop and mobile

### Security

- 🔒 JWT-based authentication
- 🔒 Bcrypt password hashing
- 🔒 User-level file isolation
- 🔒 Input validation (email, username, password)
- 🔒 File type restrictions
- 🔒 Unique filename generation (prevents overwrites)

### Network Access

- 🌐 Access via localhost: `http://localhost:5000`
- 🌐 Access via network IP: `http://192.168.x.x:5000`
- 🌐 Works on any device connected to the network

## 🛠 Tech Stack

| Component          | Technology                        |
| ------------------ | --------------------------------- |
| **Frontend**       | HTML5, CSS3, JavaScript (Vanilla) |
| **Backend**        | Node.js, Express.js               |
| **Database**       | MongoDB + Mongoose ODM            |
| **Authentication** | JWT (JSON Web Tokens)             |
| **File Upload**    | Multer                            |
| **Security**       | bcryptjs, CORS                    |
| **Validation**     | express-validator                 |

## 📦 Installation & Setup

### Prerequisites

- **Node.js** v14+ ([Download](https://nodejs.org/))
- **MongoDB Atlas** account (Cloud Database - Free tier available)

### Quick Start (Windows)

```bash
# 1. Navigate to project
cd "c:\Users\PC\cloud storage"

# 2. Setup MongoDB Atlas (see QUICK_START.md)
# 3. Test Atlas connection
TEST_ATLAS.bat

# 4. Run quick start script
START_SERVER.bat
```

### Manual Setup

```bash
# 1. Install server dependencies
cd server
npm install

# 2. Configure MongoDB (already done in .env)
# Edit server/.env if needed

# 3. Start backend server
npm start

# Expected output:
# ========================================
# Server running successfully!
# Local Access: http://localhost:5000
# Network Access: http://192.168.1.100:5000
# ========================================
```

### Access the Application

- **Local Machine**: Open browser → `http://localhost:5000`
- **Other Devices**: `http://{server-ip}:5000` (IP shown when server starts)

## 📖 Documentation

- **[INDEX.md](INDEX.md)** - Central documentation hub and quick navigation guide
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete installation & configuration guide
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Full REST API reference

## 🚀 How It Works

### Registration & Login Flow

1. User fills registration form (username, email, password)
2. This system uses email/password authentication only — no GitHub account is required.
3. Validation ensures: letters/numbers only, valid email address, 6+ char password
4. Password hashed with bcrypt, saved to MongoDB
5. JWT token generated & returned to client
6. Token stored in localStorage
7. Redirect to dashboard

### File Upload Flow

1. User selects file(s) or drag-drops
2. File type detected (MIME type)
3. Unique filename generated: `{timestamp}_{randomString}_{originalName}`
4. Stored in: `/uploads/{type}/{userId}/`
5. Metadata saved to MongoDB
6. Frontend updated with progress

### File Organization

```
uploads/
├── images/
│   └── {userId}/
│       ├── 1712345678_abcd1234_photo.jpg
│       └── 1712345679_efgh5678_image.png
├── videos/
│   └── {userId}/
│       └── 1712345680_ijkl9012_movie.mp4
├── documents/
│   └── {userId}/
│       ├── 1712345681_mnop3456_report.pdf
│       └── 1712345682_qrst7890_sheet.xlsx
└── others/
    └── {userId}/
        └── 1712345683_uvwx1234_file.zip
```

## 🔐 Validation Rules

### Username

- Only letters (A-Z, a-z) and numbers (0-9)
- No spaces, special characters, or symbols
- Must be unique

### Email

- Must be a valid email address
- Must be unique

### Password

- Minimum 6 characters
- Case-sensitive
- Hashed before storage

### Files

- Max size: 50MB
- Allowed types: Images, Videos, Documents, Others
- Stored with unique names (no overwrites)

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login & get token

### Files (Requires Authentication Token)

- `GET /api/files` - Get all user files
- `POST /api/files/upload` - Upload file
- `GET /api/files/download/:id` - Download file
- `DELETE /api/files/:id` - Delete file

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed endpoint documentation.

## 🧪 Testing

### Test User

```
Username: testuser123
Email: testuser@gmail.com
Password: testpass123
```

### Quick Test Steps

1. Open `http://localhost:5000`
2. Click "Register"
3. Fill form with test user data
4. Upload a test file
5. See it in dashboard with preview
6. Test download and delete functions

## 📁 Project Structure

```
personal-cloud-storage/
├── server/
│   ├── config/database.js         (MongoDB config)
│   ├── controllers/               (Business logic)
│   │   ├── authController.js
│   │   └── fileController.js
│   ├── middleware/                (Express middleware)
│   │   ├── auth.js                (JWT verification)
│   │   └── upload.js              (File upload handling)
│   ├── models/                    (Data schemas)
│   │   ├── User.js
│   │   └── File.js
│   ├── routes/                    (API endpoints)
│   │   ├── auth.js
│   │   └── files.js
│   ├── uploads/                   (File storage)
│   ├── server.js                  (App entry point)
│   ├── package.json
│   └── .env                       (Configuration)
│
├── client/
│   ├── index.html                 (Main page)
│   ├── css/styles.css             (Styling)
│   └── js/
│       ├── api.js                 (API client)
│       ├── auth.js                (Auth logic)
│       └── dashboard.js           (File management)
│
├── SETUP_GUIDE.md                 (Installation guide)
├── API_DOCUMENTATION.md           (API reference)
├── START_SERVER.bat               (Quick start - Windows)
└── start_server.sh                (Quick start - Mac/Linux)
```

## 🔧 Configuration

### MongoDB Connection

Edit `server/.env`:

```env
# Local MongoDB (default)
MONGO_URI=mongodb://127.0.0.1:27017/cloudstorage

# Or MongoDB Atlas
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/cloudstorage
```

### Server Settings

```env
PORT=5000                           # Server port
NODE_ENV=development               # Environment
JWT_SECRET=dev_secret_key_123...   # JWT signing key
MAX_FILE_SIZE=52428800            # 50MB in bytes
```

## 🐛 Troubleshooting

### Server Won't Start

```bash
# Check Node.js
node --version

# Check MongoDB running
mongosh

# Check port 5000 available
netstat -ano | findstr :5000
```

### MongoDB Connection Failed

- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

### Upload Issues

- Check file size < 50MB
- Verify file type is allowed
- Check token in localStorage

### See [SETUP_GUIDE.md](SETUP_GUIDE.md) for more troubleshooting tips

## 🚀 Performance

- **Upload**: Displays real-time progress
- **File Organization**: Auto-sorted by type
- **Search**: Real-time filtering
- **Database**: Indexed queries for speed

## 🔒 Security Considerations

For **production deployment**:

1. Change `JWT_SECRET` to random 64-char string
2. Enable HTTPS with SSL certificate
3. Implement rate limiting
4. Add database backups
5. Use MongoDB Atlas for cloud deployment
6. Implement audit logging

## 📝 Future Enhancements

- [ ] File sharing with expiring links
- [ ] Folder organization
- [ ] Bulk file operations
- [ ] File versioning history
- [ ] Activity logs
- [ ] Storage quota per user
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] File encryption

## 📄 License

This is a personal/educational project. Use at your own discretion.

## 🤝 Support

For issues or questions:

1. Check the [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. Check browser console (F12) for errors
4. Review server terminal output

---

**Enjoy your personal cloud storage! ☁️**

Created with ❤️ for secure, local file management

- **File Upload**: Multer with file type validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or cloud instance like MongoDB Atlas)

## Installation

1. **Clone or download the project**

2. **Install MongoDB**
   - Download and install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud): Create a free cluster and get the connection string

3. **Install dependencies**

   ```bash
   cd server
   npm install
   ```

4. **Configure MongoDB connection**
   - For local MongoDB: Ensure MongoDB is running on `mongodb://localhost:27017`
   - For MongoDB Atlas: Update `server/config/database.js` with your connection string

5. **Start the server**

   ```bash
   npm start
   ```

6. **Access the application**
   - Open your browser and go to `http://localhost:5000`
   - Or on network: `http://YOUR_LOCAL_IP:5000`

## Project Structure

```
cloud-storage/
├── server/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── fileController.js    # File operations
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── upload.js            # File upload configuration
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── File.js              # File schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   └── files.js             # File routes
│   ├── uploads/                 # Organized file storage
│   │   ├── images/
│   │   ├── videos/
│   │   ├── documents/
│   │   └── others/
│   ├── package.json
│   └── server.js                # Main server file
└── client/
    ├── css/
    │   └── styles.css           # Styles
    ├── js/
    │   ├── api.js               # API utilities
    │   ├── auth.js              # Authentication frontend
    │   └── dashboard.js         # Dashboard logic
    └── index.html               # Main HTML file
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Files

- `GET /api/files` - Get user's files
- `POST /api/files/upload` - Upload file
- `GET /api/files/download/:id` - Download file
- `DELETE /api/files/:id` - Delete file

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- File type validation
- File size limits (50MB)
- Input validation and sanitization
- CORS configuration

## Usage

1. **Register**: Create an account with username, email (@gmail.com), and password (min 6 chars)
2. **Login**: Use your credentials to log in
3. **Upload**: Select files and click upload (supports multiple files)
4. **Manage**: View, download, or delete your files
5. **Search**: Use the search bar to find files by name
6. **Filter**: Filter by file type
7. **Sort**: Sort by date or size

## Development

To run in development mode with auto-restart:

```bash
npm install -g nodemon
npm run dev
```

## Troubleshooting

- **MongoDB connection error**: Ensure MongoDB is running locally or update connection string
- **File upload fails**: Check file size (max 50MB) and type restrictions
- **CORS issues**: Ensure server is running on the correct port and IP

## License

This project is for educational purposes.
