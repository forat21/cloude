// API utility functions
// Automatically detect API base URL (works when served from the backend or opened locally)
const API_ORIGIN = (window.location.protocol === 'file:' || !window.location.hostname)
  ? 'http://localhost:5000'
  : `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
const API_BASE = `${API_ORIGIN}/api`;
const UPLOAD_BASE = API_ORIGIN;

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
      const response = await fetch(url, config);
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