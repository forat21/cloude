// Dashboard logic
let allFiles = [];
let filteredFiles = [];

document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle
  document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    document.getElementById('dark-mode-toggle').textContent = isDark ? '☀️' : '🌙';
  });

  // Load dark mode preference
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('dark-mode-toggle').textContent = '☀️';
  }

  // Upload functionality
  document.getElementById('upload-btn').addEventListener('click', uploadFiles);

  // Search and filter
  document.getElementById('search-input').addEventListener('input', filterFiles);
  document.getElementById('filter-select').addEventListener('change', filterFiles);
  document.getElementById('sort-select').addEventListener('change', sortFiles);
});

async function loadFiles() {
  try {
    const data = await API.getFiles();
    allFiles = data;
    filteredFiles = [...allFiles];
    renderFiles();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

function renderFiles() {
  const filesList = document.getElementById('files-list');
  filesList.innerHTML = '';

  if (filteredFiles.length === 0) {
    filesList.innerHTML = '<p>No files found.</p>';
    return;
  }

  filteredFiles.forEach(file => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';

    const preview = getFilePreview(file);
    const size = formatFileSize(file.fileSize);
    const date = new Date(file.uploadDate).toLocaleDateString();

    fileItem.innerHTML = `
      ${preview}
      <div class="file-info">
        <h3>${file.originalName}</h3>
        <p>Type: ${file.fileType}</p>
        <p>Size: ${size}</p>
        <p>Uploaded: ${date}</p>
      </div>
      <div class="file-actions">
        <button class="btn btn-download" onclick="downloadFile('${file._id}')">Download</button>
        <button class="btn btn-delete" onclick="deleteFile('${file._id}')">Delete</button>
      </div>
    `;

    filesList.appendChild(fileItem);
  });
}

function getFilePreview(file) {
  const filePath = `http://${window.location.hostname}:5000/${file.filePath}`;

  if (file.fileType === 'images') {
    return `<img src="${filePath}" alt="${file.originalName}" class="file-preview">`;
  } else if (file.fileType === 'videos') {
    return `<video class="file-preview" controls><source src="${filePath}" type="video/mp4"></video>`;
  } else if (file.fileType === 'documents' && file.originalName.toLowerCase().endsWith('.pdf')) {
    return `<iframe src="${filePath}" class="file-preview"></iframe>`;
  } else {
    return `<div class="file-preview" style="background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 48px;">📄</div>`;
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function uploadFiles() {
  const fileInput = document.getElementById('file-input');
  const files = fileInput.files;

  if (files.length === 0) {
    showNotification('Please select files to upload', 'error');
    return;
  }

  const uploadProgress = document.getElementById('upload-progress');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  uploadProgress.classList.remove('hidden');

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const formData = new FormData();
    formData.append('file', file);

    try {
      await API.uploadFile(formData, (progress) => {
        progressBar.value = progress;
        progressText.textContent = `${Math.round(progress)}%`;
      });

      showNotification(`File "${file.name}" uploaded successfully!`);
    } catch (error) {
      showNotification(`Failed to upload "${file.name}": ${error.message}`, 'error');
    }
  }

  uploadProgress.classList.add('hidden');
  progressBar.value = 0;
  progressText.textContent = '0%';
  fileInput.value = '';
  loadFiles(); // Reload files after upload
}

async function downloadFile(fileId) {
  try {
    await API.downloadFile(fileId);
    showNotification('File downloaded successfully!');
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

async function deleteFile(fileId) {
  if (!confirm('Are you sure you want to delete this file?')) return;

  try {
    await API.deleteFile(fileId);
    showNotification('File deleted successfully!');
    loadFiles(); // Reload files after deletion
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

function filterFiles() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const filterType = document.getElementById('filter-select').value;

  filteredFiles = allFiles.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm);
    const matchesType = filterType === 'all' || file.fileType === filterType;
    return matchesSearch && matchesType;
  });

  sortFiles();
  renderFiles();
}

function sortFiles() {
  const sortBy = document.getElementById('sort-select').value;

  filteredFiles.sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.uploadDate) - new Date(b.uploadDate);
      case 'date-desc':
        return new Date(b.uploadDate) - new Date(a.uploadDate);
      case 'size-asc':
        return a.fileSize - b.fileSize;
      case 'size-desc':
        return b.fileSize - a.fileSize;
      default:
        return 0;
    }
  });

  renderFiles();
}