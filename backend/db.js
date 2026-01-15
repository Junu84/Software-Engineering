// db.js — setup and helper for SQLite (better-sqlite3)
const Database = require('better-sqlite3');
const path = require('path');

const DB_FILE = path.join(__dirname, 'littlewins.db');
const db = new Database(DB_FILE);

// =========================
// INIT TABLES
// =========================
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    mode TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_hints TEXT DEFAULT '',
    activity_type TEXT DEFAULT 'generic',
    payload TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    mode TEXT NOT NULL,
    duration INTEGER NOT NULL,
    activity_id TEXT NOT NULL,
    activity_title TEXT NOT NULL,
    started_at DATETIME,
    completed_at DATETIME NOT NULL,
    photo TEXT,
    sensor_result TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// =========================
// SEED ACTIVITIES (ONCE)
// =========================
const activityCount = db.prepare('SELECT COUNT(*) AS c FROM activities').get().c;

if (activityCount === 0) {
  console.log('🌱 Seeding activities...');

  const insert = db.prepare(`
    INSERT INTO activities
      (id, mode, title, description, duration_hints, activity_type, payload)
    VALUES
      (?, ?, ?, ?, ?, ?, ?)
  `);

  const activities = [
    // Mood Booster
    ['mb-1', 'Mood Booster', 'Gratitude Pause', 'Write down one thing you are grateful for.', '3,5,10,15', 'generic', null],
    ['mb-2', 'Mood Booster', 'Smile Break', 'Smile for 30 seconds and notice how you feel.', '3,5', 'generic', null],

    // Brain Booster
    ['bb-1', 'Brain Booster', 'Quick Puzzle', 'Solve a simple riddle or brain teaser.', '5,10', 'generic', null],
    ['bb-2', 'Brain Booster', 'Memory Recall', 'Recall 5 things you learned recently.', '3,5', 'generic', null],

    // Relax & Reset
    ['rr-1', 'Relax & Reset', 'Deep Breathing', 'Breathe in for 4 seconds, out for 6 seconds.', '3,5,10', 'generic', null],
    ['rr-2', 'Relax & Reset', 'Body Scan', 'Scan your body for tension and relax it.', '5,10,15', 'generic', null],

    // Kindness & Connection
    ['kc-1', 'Kindness & Connection', 'Kind Message', 'Send a kind message to someone.', '3,5', 'generic', null],
    ['kc-2', 'Kindness & Connection', 'Self Kindness', 'Say one kind thing to yourself.', '3,5', 'generic', null]
  ];

  const tx = db.transaction(() => {
    for (const a of activities) insert.run(...a);
  });

  tx();
  console.log('✅ Activities seeded');
}

module.exports = db;
