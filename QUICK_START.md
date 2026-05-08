# 🎯 GETTING STARTED - Visual Quick Guide

## Step 1: Prerequisites Check ✓

```
✓ Node.js installed?          node --version
✓ MongoDB Atlas account?      https://cloud.mongodb.com
✓ Port 5000 available?        netstat -ano | findstr :5000
✓ Internet connection?        (for npm packages & Atlas)
```

---

## Step 2: Setup MongoDB Atlas (Cloud Database)

### Create Free Atlas Account

1. **Go to**: https://cloud.mongodb.com
2. **Sign up** with email (free tier available)
3. **Create cluster** (choose FREE tier)
4. **Wait 5-10 minutes** for cluster to be ready

### Configure Database Access

1. **Database Access** → **Add New Database User**
   - Username: `clouduser`
   - Password: Choose secure password
   - Click "Add User"

2. **Network Access** → **Add IP Address**
   - Click "Allow Access from Anywhere"
   - Click "Confirm"

3. **Get Connection String**
   - **Clusters** → **Connect** → **Connect your application**
   - Copy the connection string
   - It looks like: `mongodb+srv://clouduser:xxxxx@cluster0.xxxxx.mongodb.net/cloudstorage?retryWrites=true&w=majority`

4. **Update .env file** (already done for you!)
   ```
   MONGO_URI=mongodb+srv://clouduser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cloudstorage?retryWrites=true&w=majority
   ```

**✅ Your .env is pre-configured for Atlas!**

**Need help?** See [SETUP_GUIDE.md - MongoDB Atlas Setup](SETUP_GUIDE.md#-mongodb-atlas-cloud---recommended)

---

## Step 2.5: Test Atlas Connection (Optional)

```batch
# Test your MongoDB Atlas connection
TEST_ATLAS.bat
```

**Expected Output:**

```
✅ SUCCESS: MongoDB Atlas connected successfully!
Your cloud database is ready.
```

---

## Step 3: Start the Server

### Windows

```batch
cd "c:\Users\PC\cloud storage"
START_SERVER.bat
```

### Mac/Linux

```bash
cd ~/path/to/cloud\ storage
bash start_server.sh
```

### Manual (All Systems)

```bash
cd server
npm install  # Only first time
npm start
```

---

## Step 4: Expected Output

```
========================================
Server running successfully!
Local Access: http://localhost:5000
Network Access: http://192.168.1.100:5000
========================================

✓ MongoDB Connected: localhost
✓ Express listening on 0.0.0.0:5000
```

✅ **If you see this, server is running!**

---

## Step 5: Access Application

### Local Machine (Same Computer)

Open browser → **http://localhost:5000**

### Another Device on Network

Open browser → **http://192.168.1.100:5000**
(Replace IP with actual server IP from startup message)

---

## Step 6: Test the System

### A. Register New Account

```
1. Click "Register"
2. Fill form:
   ├─ Username: testuser123
   ├─ Email: testuser@gmail.com
   └─ Password: testpass123
3. Click "Register"
4. ✓ Auto-redirects to Dashboard
```

### B. Upload a File

```
1. Click "Upload Files"
2. Select file from computer
3. Watch progress bar
4. ✓ File appears in dashboard
```

### C. Search & Filter

```
1. Type in search box
2. Files filter in real-time
3. Use Type filter dropdown
4. Use Sort dropdown
```

### D. Download File

```
1. Click "Download" button
2. ✓ File downloads to computer
```

### E. Delete File

```
1. Click "Delete" button
2. Confirm deletion
3. ✓ File removed from dashboard
```

---

## Troubleshooting Guide

### ❌ Server Won't Start

```
Error: Cannot find module 'express'
✓ Fix: cd server && npm install

Error: Port 5000 already in use
✓ Fix: Close other apps on port 5000

Error: MongoDB connection failed
✓ Fix: Start MongoDB service (mongosh)
```

### ❌ Can't Access from Browser

```
Error: Connection refused at localhost:5000
✓ Fix: Is server running? Check terminal

Error: Cannot access from another device
✓ Fix: Use server's IP from startup message
```

### ❌ Upload Fails

```
Error: File too large
✓ Fix: Upload files < 50MB

Error: File type not allowed
✓ Fix: Upload: images, videos, docs, others
```

### ❌ Files Not Showing

```
No files appear after upload
✓ Fix 1: Refresh page (F5)
✓ Fix 2: Check browser console (F12)
✓ Fix 3: Check server terminal for errors
```

---

## File Storage Locations

### When You Upload

```
You upload: photo.jpg

Server stores in:
/server/uploads/
├── images/
│   └── {your_user_id}/
│       └── 1712345678_abcd1234_photo.jpg
```

**Auto-organized by:**

- File type (images, videos, documents, others)
- Your user ID (secure isolation)
- Unique name (prevents duplicates)

---

## API Endpoints Quick Reference

```javascript
// Register
POST /api/auth/register
{username, email, password}

// Login
POST /api/auth/login
{email, password}

// Get Files (requires token)
GET /api/files

// Upload File (requires token)
POST /api/files/upload
FormData: {file}

// Download File (requires token)
GET /api/files/download/:id

// Delete File (requires token)
DELETE /api/files/:id
```

---

## Configuration Files

### Main Config: `server/.env`

```env
MONGO_URI=mongodb://127.0.0.1:27017/cloudstorage
PORT=5000
JWT_SECRET=dev_secret_key_123456789
MAX_FILE_SIZE=52428800
```

### To Change Settings:

1. Stop server (Ctrl+C)
2. Edit `server/.env`
3. Restart server

---

## Validation Rules

### Username

- ✓ Letters & numbers only
- ✗ No spaces or special chars
- ✗ Example: john@123 ❌ (no @)
- ✓ Example: john123 ✅

### Email

- ✓ Must be: user@gmail.com
- ✗ Other emails won't work
- ✗ Example: john@yahoo.com ❌
- ✓ Example: john123@gmail.com ✅

### Password

- ✓ Minimum 6 characters
- ✓ Any characters allowed
- ✗ Example: 12345 ❌ (too short)
- ✓ Example: MyPass123 ✅

### Files

- ✓ Max size: 50MB
- ✓ Types: Images, Videos, Documents, Others
- ✗ Unsafe files blocked
- ✓ Auto-organized by type

---

## Dashboard Features

| Feature       | How to Use                         |
| ------------- | ---------------------------------- |
| **Upload**    | Click "Upload Files" or drag files |
| **Search**    | Type filename in search box        |
| **Filter**    | Select type from dropdown          |
| **Sort**      | Choose sort option (date/size)     |
| **Preview**   | Hover over file to see preview     |
| **Download**  | Click "Download" button            |
| **Delete**    | Click "Delete" + confirm           |
| **Dark Mode** | Click moon icon 🌙                 |
| **Logout**    | Click "Logout" button              |

---

## Security Notes

✓ **Your files are:**

- Encrypted with HTTPS (recommended for production)
- Isolated by user ID
- Protected by JWT authentication
- Verified on download/delete

✓ **Your password is:**

- Hashed with bcrypt
- Never stored in plain text
- Secure against brute force

✓ **Your token:**

- Expires after 7 days
- Stored in browser locally
- Required for all file operations

---

## Performance Tips

| Tip                    | Benefit                   |
| ---------------------- | ------------------------- |
| Use WiFi instead of 3G | Faster uploads            |
| Upload during off-peak | Better server performance |
| Close browser tabs     | More memory for uploads   |
| Use Chrome/Firefox     | Better file handling      |
| Keep files < 50MB      | Faster uploads            |

---

## Mobile Access

### From Phone/Tablet

```
1. Connect to same WiFi as server
2. Find server's IP (from terminal)
   Example: 192.168.1.100
3. Open browser
4. Go to: http://192.168.1.100:5000
5. Register/Login
6. Upload/manage files
```

⚠️ **Note:** Responsive design works on mobile

---

## System Requirements

```
Minimum:
- CPU: Dual core processor
- RAM: 2GB
- Disk: 10GB free (for files)
- OS: Windows, Mac, or Linux

Recommended:
- CPU: Quad core processor
- RAM: 4GB+
- Disk: 50GB+ free
- Network: Ethernet (faster than WiFi)
```

---

## Database Info

### What Gets Stored

**Users Collection:**

- Username
- Email
- Password (hashed)
- Registration date

**Files Collection:**

- Original filename
- Stored filename
- File path
- File type
- File size
- Owner (user ID)
- Upload date

### Where It's Stored

- Local: `mongodb://127.0.0.1:27017`
- Cloud: MongoDB Atlas (optional)

---

## Common Tasks

### Add New User

1. Click Register
2. Fill form
3. Click Register button
   ✓ Account created

### Switch Account

1. Click Logout
2. Login with different email
3. See only your files (isolated)
   ✓ User isolation working

### Backup Files

1. Download all files
2. Save to external drive
   ✓ Backup complete

### Delete Everything (Reset)

1. Stop server
2. Delete MongoDB database: `cloudstorage`
3. Restart server
   ✓ Fresh start

---

## Contact & Support

**Issues?** Check these files in order:

1. **Quick Fix**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. **API Help**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
4. **Checklist**: [CONFIGURATION_CHECKLIST.md](CONFIGURATION_CHECKLIST.md)

---

## Success Checklist ✅

When system is working, verify:

```
✅ Server starts without errors
✅ Can access http://localhost:5000
✅ Can register new account
✅ Can login successfully
✅ Can upload files
✅ Files appear in dashboard
✅ Can download files
✅ Can delete files
✅ Search works
✅ Filter works
✅ Sort works
✅ Dark mode works
```

---

## Quick Commands Reference

```bash
# Start server
cd server && npm start

# Check MongoDB
mongosh

# Install dependencies
npm install

# Check Node version
node --version

# Check npm version
npm --version

# Stop server
Ctrl+C

# Run on different port
PORT=3000 npm start
```

---

## Next Steps

1. ✅ **Start Server**: `START_SERVER.bat` or `npm start`
2. ✅ **Open Browser**: http://localhost:5000
3. ✅ **Register Account**: testuser@gmail.com
4. ✅ **Upload File**: Click Upload Files
5. ✅ **Test Features**: Search, filter, download

---

## 🎉 You're All Set!

Your Personal Cloud Storage is ready to use.

**Start server and begin storing files! ☁️**

```bash
START_SERVER.bat
```

Then open: **http://localhost:5000**

---

**Need more help?** See **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for complete documentation.
