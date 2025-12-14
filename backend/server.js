const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// simple in-memory storage
let sessions = [];
let users = [];

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Little Wins backend running' });
});

app.post('/api/register', (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email exists' });
  }
  const newUser = { id: users.length+1, email, username, password };
  users.push(newUser);
  res.status(201).json({ message: 'Registered', userId: newUser.id });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ message: 'Logged in', userId: user.id });
});

app.post('/api/sessions', (req, res) => {
  const { userId, mode, durationMinutes } = req.body;
  const newSession = { id: sessions.length+1, userId, mode, durationMinutes, status:'RUNNING' };
  sessions.push(newSession);
  res.status(201).json(newSession);
});

app.post('/api/register', (req, res) => {
  const { email, username, password } = req.body;

  // 1) Validierung
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'email, username and password are required' });
  }

  // 2) Prüfen, ob E-Mail schon existiert
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'A user with this email already exists' });
  }

  // 3) Neuen User anlegen
  const newUser = {
    id: users.length + 1,
    email,
    username,
    password // MVP: noch ohne Hash
  };

  users.push(newUser);

  // 4) Erfolg zurückgeben (ohne Passwort)
  res.status(201).json({
    message: 'Registration successful',
    userId: newUser.id,
    username: newUser.username
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Einfach: userId zurückgeben
  res.json({
    message: 'Login successful',
    userId: user.id,
    username: user.username
  });
});

app.post('/api/sessions', (req, res) => {
  const { userId, mode, durationMinutes } = req.body;

  // 1) Validierung
  if (!userId || !mode || !durationMinutes) {
    return res.status(400).json({ error: 'userId, mode and durationMinutes are required' });
  }

  // (Optional) prüfen, ob der Mode gültig ist
  const validModes = ['MOOD_BOOSTER', 'BRAIN_BOOSTER', 'RELAX_RESET', 'KINDNESS_CONNECTION'];
  if (!validModes.includes(mode)) {
    return res.status(400).json({ error: 'Invalid mode' });
  }

  const validDurations = [3, 5, 10, 15];
  if (!validDurations.includes(Number(durationMinutes))) {
    return res.status(400).json({ error: 'Invalid duration' });
  }

  // 2) Neue Session anlegen
  const newSession = {
    id: sessions.length + 1,
    userId,
    mode,
    durationMinutes: Number(durationMinutes),
    status: 'RUNNING'
  };

  sessions.push(newSession);

  // 3) Session zurückschicken
  res.status(201).json(newSession);
});

app.listen(PORT, () => console.log(`Backend at http://localhost:${PORT}`));