// Authentication logic
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    showDashboard();
  } else {
    showAuth();
  }

  // Form switching
  document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
  });

  document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
  });

  // Login form
  document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const data = await API.login({ email, password });
      localStorage.setItem('token', data.token);
      showNotification('Login successful!');
      showDashboard();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });

  // Register form
  document.getElementById('register').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
      const data = await API.register({ username, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      showNotification('Registration successful!');
      showDashboard();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });

  // Password visibility toggles
  document.getElementById('login-show-password').addEventListener('change', (e) => {
    const loginPassword = document.getElementById('login-password');
    loginPassword.type = e.target.checked ? 'text' : 'password';
  });

  document.getElementById('register-show-password').addEventListener('change', (e) => {
    const registerPassword = document.getElementById('register-password');
    registerPassword.type = e.target.checked ? 'text' : 'password';
  });

  // Logout
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    showAuth();
    showNotification('Logged out successfully!');
  });
});

function showAuth() {
  document.getElementById('auth-section').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  loadFiles(); // Load files when showing dashboard
}