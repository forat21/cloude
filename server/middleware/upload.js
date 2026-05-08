const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Allowed file types
const allowedTypes = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/avi', 'video/mov', 'video/webm', 'video/mkv',
  'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'application/zip', 'application/x-zip-compressed'
];

// File type categories
const getFileCategory = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'images';
  if (mimetype.startsWith('video/')) return 'videos';
  if (mimetype === 'application/pdf' || mimetype.includes('document') || mimetype === 'text/plain') return 'documents';
  return 'others';
};

// GridFS Storage for videos and large files
const gridFsStorage = new GridFsStorage({
  url: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cloudstorage',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const userId = req.user.id;
      const category = getFileCategory(file.mimetype);
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(4).toString('hex');
      const ext = path.extname(file.originalname);
      const filename = `${timestamp}_${randomString}${ext}`;

      const fileInfo = {
        filename: filename,
        bucketName: 'uploads',
        metadata: {
          originalName: file.originalname,
          userId: userId,
          fileType: category,
          uploadDate: new Date(),
          contentType: file.mimetype,
          storageType: 'gridfs'
        }
      };
      resolve(fileInfo);
    });
  }
});

// Regular disk storage for smaller files
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.id;
    const category = getFileCategory(file.mimetype);
    const dir = path.join(__dirname, '../uploads', category, userId);

    // Create directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString('hex');
    const ext = path.extname(file.originalname);
    const storedName = `${timestamp}_${randomString}${ext}`;
    cb(null, storedName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

// Dynamic upload middleware that chooses storage based on file type
const dynamicUpload = (req, res, next) => {
  // Use a temporary multer instance to check the file type first
  const tempMulter = multer({
    storage: diskStorage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: fileFilter,
  });

  tempMulter.single('file')(req, res, (err) => {
    if (err) return next(err);

    if (req.file && req.file.mimetype && req.file.mimetype.startsWith('video/')) {
      // It's a video, move to GridFS
      const fs = require('fs');
      const sourcePath = req.file.path;

      if (fs.existsSync(sourcePath)) {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
          bucketName: 'uploads'
        });

        const uploadStream = bucket.openUploadStream(req.file.filename, {
          metadata: {
            originalName: req.file.originalname,
            userId: req.user.id,
            fileType: 'videos',
            uploadDate: new Date(),
            contentType: req.file.mimetype,
            storageType: 'gridfs'
          }
        });

        fs.createReadStream(sourcePath)
          .pipe(uploadStream)
          .on('error', (error) => {
            console.error('GridFS upload error:', error);
            next(error);
          })
          .on('finish', () => {
            // Update req.file to reflect GridFS storage
            req.file.id = uploadStream.id;
            req.file.bucketName = 'uploads';
            req.file.storageType = 'gridfs';

            // Clean up temp file
            fs.unlinkSync(sourcePath);
            next();
          });
      } else {
        next();
      }
    } else {
      // Not a video, keep filesystem storage
      next();
    }
  });
};

module.exports = dynamicUpload;