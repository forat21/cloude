// API utility functions
// Automatically detect API base URL for local and deployed environments
const host = window.location.hostname;
const isLocalHost = host === 'localhost' || host === '127.0.0.1';
const isLocalNetwork = /^10\.|^192\.168\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host);

const API_BASE = window.location.protocol === 'file:'
  ? 'http://localhost:5000/api'
  : isLocalHost || isLocalNetwork
  ? `http://${host}:5000/api`
  : window.location.hostname.includes('vercel.app')
  ? 'https://your-render-app.onrender.com/api'  // For separate deployment
  : '/api';  // Relative for same-domain deployment (Railway)

const UPLOAD_BASE = window.location.protocol === 'file:'
  ? 'http://localhost:5000'
  : isLocalHost || isLocalNetwork
  ? `http://${host}:5000`
  : window.location.hostname.includes('vercel.app')
  ? 'https://your-render-app.onrender.com'
  : '';  // Relative for same-domain

class API {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...config,
        credentials: 'include'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to reach the backend. Make sure the server is running on http://localhost:5000 and open the app from that same host.');
      }
      throw error;
    }
  }

  static async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async getFiles() {
    return this.request('/files');
  }

  static async uploadFile(formData, onProgress) {
    const token = localStorage.getItem('token');
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.open('POST', `${API_BASE}/files/upload`);

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(JSON.parse(xhr.responseText).message));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));

      xhr.send(formData);
    });
  }

  static async downloadFile(fileId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/files/download/${fileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = ''; // Will be set by server
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  static async deleteFile(fileId) {
    return this.request(`/files/${fileId}`, {
      method: 'DELETE',
    });
  }
}

// Notification system
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = type;
  notification.classList.remove('hidden');

  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}