const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');
const dynamicUpload = require('../middleware/upload');

router.get('/', auth, fileController.getFiles);
router.post('/upload', auth, dynamicUpload, fileController.uploadFile);
router.get('/download/:id', auth, fileController.downloadFile);
router.delete('/:id', auth, fileController.deleteFile);

module.exports = router;