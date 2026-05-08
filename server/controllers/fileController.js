const File = require('../models/File');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const mongoose = require('mongoose');

exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id }).sort({ uploadDate: -1 });
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const { originalname, filename, size, mimetype } = req.file;
    const userId = req.user.id;

    // Determine file type category
    let fileType = 'others';
    if (mimetype.startsWith('image/')) fileType = 'images';
    else if (mimetype.startsWith('video/')) fileType = 'videos';
    else if (
      mimetype === 'application/pdf' ||
      mimetype.includes('word') ||
      mimetype.includes('document') ||
      mimetype === 'text/plain' ||
      mimetype.includes('spreadsheet') ||
      mimetype.includes('presentation')
    ) {
      fileType = 'documents';
    }

    let fileData = {
      originalName: originalname,
      storedName: filename,
      fileType,
      fileSize: size,
      mimeType: mimetype,
      userId,
    };

    // Check if file was stored in GridFS (large files/videos)
    if (req.file.id) {
      // GridFS storage
      fileData.gridFsId = req.file.id;
      fileData.bucketName = req.file.bucketName || 'uploads';
      fileData.storageType = 'gridfs';
    } else {
      // Filesystem storage
      fileData.filePath = path.join('uploads', fileType, userId, filename);
      fileData.storageType = 'filesystem';
    }

    const file = new File(fileData);
    await file.save();

    res.json({
      message: 'File uploaded successfully',
      file,
      data: file
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.storageType === 'gridfs') {
      // Download from GridFS
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: file.bucketName
      });

      const downloadStream = bucket.openDownloadStream(file.gridFsId);

      downloadStream.on('error', (err) => {
        console.error('GridFS download error:', err);
        res.status(500).json({ message: 'Error downloading file' });
      });

      res.setHeader('Content-Type', file.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);

      downloadStream.pipe(res);
    } else {
      // Download from filesystem
      const filePath = path.join(__dirname, '..', file.filePath);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found on server' });
      }

      res.download(filePath, file.originalName);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during download' });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.storageType === 'gridfs') {
      // Delete from GridFS
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: file.bucketName
      });

      await bucket.delete(file.gridFsId);
    } else {
      // Delete from filesystem
      const filePath = path.join(__dirname, '..', file.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await File.findByIdAndDelete(req.params.id);
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during deletion' });
  }
};