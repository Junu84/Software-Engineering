// server.js — Express backend for Little Wins
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');
const { getActivity } = require('./activityService');
require('dotenv').config(); // loads backend/.env in dev (do not commit .env)




const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-dev-key';
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Helper: create token
function createToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
}

// Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/*
  Routes:
  - POST /api/register { email, username, password }
  - POST /api/login { identity, password } (identity = email or username)
  - GET  /api/me (auth)
  - GET  /api/activities?mode=&duration= (auth)
  - POST /api/sessions (auth)
  - GET  /api/sessions/stats (auth)
  - GET  /api/sessions/daily-counts (auth)
  - GET  /api/activities/all (debug)
*/

app.post('/api/register', async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) return res.status(400).json({ error: 'Missing fields' });

  const exists = db
    .prepare('SELECT id FROM users WHERE email = ? OR username = ?')
    .get(email.toLowerCase(), username);

  if (exists) return res.status(409).json({ error: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const info = db
    .prepare('INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)')
    .run(email.toLowerCase(), username, hash);

  const user = db.prepare('SELECT id, email, username FROM users WHERE id = ?').get(info.lastInsertRowid);
  const token = createToken(user);
  res.json({ token, user });
});

app.post('/api/login', (req, res) => {
  const { identity, password } = req.body;

  if (!identity || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  const user = db.prepare(`
    SELECT * FROM users
    WHERE username = ? OR email = ?
  `).get(identity, identity.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = createToken(user);
  res.json({ token });
});



// Activities selection (S5: delegated to activityService)
app.get('/api/activities', authMiddleware, (req, res) => {
  const { mode, duration, excludeId } = req.query;

  if (!mode) {
    return res.status(400).json({ error: 'mode required' });
  }

  const activity = getActivity({
    db,
    mode,
    duration,
    excludeId
  });

  if (!activity) {
    return res.status(404).json({ error: 'No activity found' });
  }

  res.json({ activity });
});


// Create a session (complete)
app.post('/api/sessions', authMiddleware, (req, res) => {
  const { mode, duration, activityId, activityTitle, startedAt, completedAt, photo, sensorResult } = req.body;

  if (!mode || duration === undefined || !activityId || !activityTitle || !completedAt) {
    return res.status(400).json({ error: 'Missing required session fields' });
  }

  // M3 duration validation (make sure duration is a Number)
  const durNum = Number(duration);
  const allowedDurations = [3, 5, 10, 15];
  if (!allowedDurations.includes(durNum)) {
    return res.status(400).json({ error: 'Invalid duration' });
  }

  const stmt = db.prepare(`
    INSERT INTO sessions
      (user_id, mode, duration, activity_id, activity_title, started_at, completed_at, photo, sensor_result)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    req.user.id,
    mode,
    durNum,
    activityId,
    activityTitle,
    startedAt || null,
    completedAt,
    photo || null,
    sensorResult ? JSON.stringify(sensorResult) : null
  );

  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(info.lastInsertRowid);
  res.json({ session });
});


// Gallery: return sessions with photos for current user
app.get('/api/sessions/gallery', authMiddleware, (req, res) => {
  const rows = db.prepare(`
    SELECT id, mode, activity_title, completed_at, photo
    FROM sessions
    WHERE user_id = ?
      AND photo IS NOT NULL
    ORDER BY completed_at DESC
  `).all(req.user.id);

  res.json({ items: rows });
});




/*
// Get memory gallery (photos only)
app.get('/api/sessions/gallery', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT id, photo, activity_title, completed_at
      FROM sessions
      WHERE user_id = ?
        AND photo IS NOT NULL
      ORDER BY completed_at DESC
    `).all(req.user.id);

    res.json({ photos: rows });
  } catch (err) {
    res.status(500).json({ error: 'Could not load gallery' });
  }
    
});

*/




// Stats: last 7 days counts and mode distribution for current user
app.get('/api/sessions/stats', authMiddleware, (req, res) => {
  const modes = ['Mood Booster', 'Brain Booster', 'Relax & Reset', 'Kindness & Connection'];
  const now = new Date();

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      key,
      label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      count: 0
    });
  }

  const sessions = db.prepare('SELECT * FROM sessions WHERE user_id = ?').all(req.user.id);
  const modeCounts = {};
  modes.forEach(m => (modeCounts[m] = 0));

  sessions.forEach(s => {
    const day = String(s.completed_at).slice(0, 10);
    const dObj = days.find(x => x.key === day);
    if (dObj) dObj.count++;
    if (modeCounts[s.mode] !== undefined) modeCounts[s.mode]++;
  });

  res.json({ days, modeCounts, total: sessions.length });
});

// Daily counts: number of completed sessions per calendar day for current user
app.get('/api/sessions/daily-counts', authMiddleware, (req, res) => {
  const rows = db.prepare(`
    SELECT substr(completed_at, 1, 10) AS day, COUNT(*) AS count
    FROM sessions
    WHERE user_id = ?
    GROUP BY day
    ORDER BY day DESC
  `).all(req.user.id);

  res.json({ days: rows });
});

// Simple route to list all activities (admin / debugging)
app.get('/api/activities/all', (req, res) => {
  const rows = db.prepare('SELECT * FROM activities').all();
  res.json({ activities: rows });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Little Wins API running on http://localhost:${port}`);
});
