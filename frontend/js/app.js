const backendBaseUrl = 'http://localhost:3000';

// --- Registration ---
const registerBtn = document.getElementById('register-btn');
const registerMsg = document.getElementById('register-msg');

if (registerBtn) {
  registerBtn.addEventListener('click', async () => {
    const email = document.getElementById('reg-email').value;
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    try {
      const response = await fetch(`${backendBaseUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        registerMsg.textContent = data.error || 'Registration failed.';
      } else {
        registerMsg.textContent = 'Registration successful. You can now log in.';
      }
    } catch (err) {
      registerMsg.textContent = 'Error connecting to server.';
      console.error(err);
    }
  });
}

// --- Login ---
const loginBtn = document.getElementById('login-btn');
const loginMsg = document.getElementById('login-msg');

if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch(`${backendBaseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        loginMsg.textContent = data.error || 'Login failed.';
      } else {
        // userId merken und zur Home-Seite gehen
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
        window.location.href = 'home.html';
      }
    } catch (err) {
      loginMsg.textContent = 'Error connecting to server.';
      console.error(err);
    }
  });
}
