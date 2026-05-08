const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  storedName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String, // For filesystem storage
  },
  gridFsId: {
    type: mongoose.Schema.Types.ObjectId, // For GridFS storage
  },
  bucketName: {
    type: String, // GridFS bucket name
    default: 'uploads'
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  storageType: {
    type: String,
    enum: ['filesystem', 'gridfs'],
    default: 'filesystem',
  },
});

module.exports = mongoose.model('File', fileSchema);