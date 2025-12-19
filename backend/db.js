// db.js — setup and helper for SQLite (better-sqlite3)
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_FILE = path.join(__dirname, 'littlewins.db');
const db = new Database(DB_FILE);

// Initialize if tables missing
function init() {
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
      description TEXT,
      duration_hints TEXT DEFAULT '' -- comma-separated ints like "3,5,10"
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
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
}

init();
module.exports = db;