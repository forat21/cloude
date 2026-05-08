# API Documentation - Personal Cloud Storage

## Base URL

```
http://localhost:5000/api
or
http://192.168.x.x:5000/api
```

## Authentication

All file endpoints require JWT token in the `Authorization` header:

```
Authorization: Bearer {token}
```

---

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Creates a new user account and returns JWT token.

**Request Body:**

```json
{
  "username": "john123",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Validation Rules:**

- `username`: Letters and numbers only (no spaces, special chars)
- `email`: Must be a valid email address
- `password`: Minimum 6 characters

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Registration successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john123",
    "email": "john@gmail.com"
  }
}
```

**Error Responses:**

```json
// Validation error
{
  "errors": [
    {
      "msg": "Username must contain only letters and numbers",
      "param": "username"
    }
  ]
}

// User exists
{
  "message": "Email already registered"
}
```

---

### 2. Login User

**POST** `/auth/login`

Authenticates user and returns JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john123",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

```json
// Invalid credentials
{
  "message": "Invalid credentials"
}
```

**Token Details:**

- Expires in: 7 days
- Algorithm: HS256
- Stored in: localStorage (frontend)

---

## 📁 File Endpoints

### 3. Get All Files

**GET** `/files`

Retrieves all files for the logged-in user, sorted by newest first.

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "originalName": "photo.jpg",
    "storedName": "1712345678_abcd1234.jpg",
    "filePath": "uploads/images/507f1f77bcf86cd799439011/1712345678_abcd1234.jpg",
    "fileType": "images",
    "fileSize": 2048576,
    "userId": "507f1f77bcf86cd799439011",
    "uploadDate": "2024-04-05T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "originalName": "document.pdf",
    "storedName": "1712346000_efgh5678.pdf",
    "filePath": "uploads/documents/507f1f77bcf86cd799439011/1712346000_efgh5678.pdf",
    "fileType": "documents",
    "fileSize": 1024576,
    "userId": "507f1f77bcf86cd799439011",
    "uploadDate": "2024-04-05T11:00:00.000Z"
  }
]
```

**Error Responses:**

```json
// No token provided
{
  "message": "No token, authorization denied"
}

// Invalid token
{
  "message": "Token is not valid"
}

// Server error
{
  "message": "Server error"
}
```

---

### 4. Upload File

**POST** `/files/upload`

Uploads a file to the server. File is automatically categorized and stored with conflict-prevention naming.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**

```
file: <binary file data>
```

**File Type Categories:**

- `images`: jpg, png, gif, webp, etc.
- `videos`: mp4, avi, mov, etc.
- `documents`: pdf, docx, doc, xlsx, pptx, txt, etc.
- `others`: All other file types

**File Storage Path:**

```
/uploads/{fileType}/{userId}/{timestamp}_{randomString}_{originalName}

Example:
/uploads/images/507f1f77bcf86cd799439011/1712345678_abcd1234_photo.jpg
```

**Filename Generation:**

```
timestamp: Unix timestamp (current time)
randomString: 8-character hex string
originalName: Original filename with extension
```

**Success Response (200):**

```json
{
  "message": "File uploaded successfully",
  "file": {
    "_id": "507f1f77bcf86cd799439014",
    "originalName": "presentation.pptx",
    "storedName": "1712347000_ijkl9012_presentation.pptx",
    "filePath": "uploads/documents/507f1f77bcf86cd799439011/1712347000_ijkl9012_presentation.pptx",
    "fileType": "documents",
    "fileSize": 5242880,
    "userId": "507f1f77bcf86cd799439011",
    "uploadDate": "2024-04-05T12:00:00.000Z"
  },
  "data": {
    /* same as file */
  }
}
```

**Constraints:**

- Max file size: 50MB (configurable)
- Allowed MIME types: See validation in middleware
- Will create directories if they don't exist

**Error Responses:**

```json
// No file uploaded
{
  "message": "No file uploaded"
}

// File type not allowed
{
  "message": "File type not allowed"
}

// File too large
{
  "message": "File too large"
}

// Unauthorized
{
  "message": "No token, authorization denied"
}
```

---

### 5. Download File

**GET** `/files/download/{fileId}`

Downloads a file. Only the file owner can download.

**Parameters:**

- `fileId`: MongoDB ObjectId of the file (from file metadata)

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response (200):**

- File binary data with appropriate headers
- `Content-Disposition: attachment; filename="originalName"`
- `Content-Type: <detected MIME type>`

**Error Responses:**

```json
// File not found or not owner
{
  "message": "File not found"
}

// File not found on server
{
  "message": "File not found on server"
}

// Unauthorized
{
  "message": "No token, authorization denied"
}
```

**Example Usage (JavaScript):**

```javascript
const fileId = "507f1f77bcf86cd799439012";
await API.downloadFile(fileId);
// File automatically downloads to user's computer
```

---

### 6. Delete File

**DELETE** `/files/{fileId}`

Permanently deletes a file. Only the file owner can delete.

**Parameters:**

- `fileId`: MongoDB ObjectId of the file

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response (200):**

```json
{
  "message": "File deleted successfully"
}
```

**Process:**

1. Verifies file ownership
2. Deletes file from filesystem
3. Removes metadata from MongoDB
4. Cannot be undone

**Error Responses:**

```json
// File not found or not owner
{
  "message": "File not found"
}

// Server error
{
  "message": "Server error during deletion"
}

// Unauthorized
{
  "message": "No token, authorization denied"
}
```

---

## 📊 Data Models

### User Schema

```javascript
{
  _id: ObjectId,
  username: String,        // Unique, letters/numbers only
  email: String,          // Unique, @gmail.com format
  password: String,       // Hashed with bcrypt
  createdAt: Date         // Auto-set to current time
}
```

### File Schema

```javascript
{
  _id: ObjectId,
  originalName: String,   // User's original filename
  storedName: String,     // Renamed for conflict prevention
  filePath: String,       // Relative path on server
  fileType: String,       // 'images', 'videos', 'documents', 'others'
  fileSize: Number,       // Size in bytes
  userId: ObjectId,       // Reference to User
  uploadDate: Date        // Auto-set to upload time
}
```

---

## 🔒 Security Features

### Authentication

- JWT tokens with HS256 algorithm
- 7-day expiration
- Secure password hashing with bcrypt (10 salt rounds)

### Authorization

- Protected endpoints require valid token
- Users can only access their own files
- File deletion verified against owner

### Input Validation

- Email format validation (valid email address)
- Username regex validation (alphanumeric only)
- Password length validation (min 6 chars)
- MIME type validation for uploads

### File Security

- Unique filenames prevent overwrites
- Files stored in user-specific directories
- Unsafe file types blocked
- File size limits enforced

---

## 🧪 Testing with cURL

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

### Get Files

```bash
curl -X GET http://localhost:5000/api/files \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Upload File

```bash
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/file.jpg"
```

### Delete File

```bash
curl -X DELETE http://localhost:5000/api/files/FILE_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📱 Frontend Integration

### Using the Provided API Class

```javascript
// Register
const data = await API.register({
  username: "john123",
  email: "john@example.com",
  password: "securepass123",
});
localStorage.setItem("token", data.token);

// Login
const data = await API.login({
  email: "john@example.com",
  password: "securepass123",
});
localStorage.setItem("token", data.token);

// Get files
const files = await API.getFiles();

// Upload
const formData = new FormData();
formData.append("file", fileInput.files[0]);
await API.uploadFile(formData, (progress) => {
  console.log(`${progress}% uploaded`);
});

// Download
await API.downloadFile(fileId);

// Delete
await API.deleteFile(fileId);
```

---

## ⚠️ Error Handling

Common HTTP Status Codes:

- `200`: Success
- `400`: Bad Request (validation error, etc.)
- `401`: Unauthorized (missing/invalid token)
- `404`: Not Found (file/user doesn't exist)
- `500`: Server Error

---

## 🔄 CORS Configuration

Server configured to accept requests from:

- `http://localhost:5000`
- `http://127.0.0.1:5000`
- Network IPs (0.0.0.0)

---

## 📝 Rate Limiting (Future Enhancement)

Currently not implemented. Recommended additions:

- Max 100 requests per minute per IP
- Max file upload size: 50MB per request
- Max 10 concurrent uploads per user

---

## 📞 Support

For issues:

1. Check server terminal for error logs
2. Check browser console (F12)
3. Review SETUP_GUIDE.md for troubleshooting
4. Verify MongoDB is running
5. Check network connectivity
