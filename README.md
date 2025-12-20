# 🌸 Little Wins – Meaningful Micro-Moments App

Little Wins is a lightweight web application that helps users turn short waiting periods into positive and meaningful moments instead of passive doomscrolling.

The app suggests short activities based on the user’s mood, intention, and available time.

---

## 🎯 Project Goals
- Encourage mindful and positive use of idle moments
- Reduce unintentional doomscrolling
- Support well-being, focus, relaxation, and social connection
- Provide simple, enjoyable micro-activities ("little wins")

---

## 🧩 Core Features (MVP)
- User registration and login
- Mode selection:
  - Mood Booster
  - Brain Booster
  - Relax & Reset
  - Kindness & Connection
- Time selection (3, 5, 10, 15 minutes)
- Automatic activity suggestion per session
- Activity completion and summary
- Session statistics (basic)

---

## 🏗️ System Architecture
The system follows a simple three-layer architecture:
- **Web Client**: Browser-based frontend (HTML, CSS, JavaScript)
- **Backend Server**: REST API using Node.js and Express
- **Database**: Stores users, sessions, and activity data
- **Optional External APIs**: Jokes, riddles, GPS, and sensor-based activities (future extensions)

---

## 📐 Project Documentation
- **SRS**: Software Requirements Specification
- **HLD**: High-Level Design including:
  - Class Diagram
  - Activity Diagram
  - Sequence Diagram
  - Use Case Diagram

---

## 🛠️ Tech Stack (Planned)
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: (to be decided, e.g. JSON / SQLite)
- Version Control: Git & GitHub

---

## 👥 Team
- Theresa Hartmann  
- Junu Rahman  
- Arooj Shahzadi  

---

## 📅 Project Status
The project is currently in the **early implementation phase**.  
Initial setup and MVP features are being implemented step by step.

---

## 📄
# Little Wins — Fullstack MVP (Node + Express + SQLite)

This scaffold implements the MUST requirements of the Little Wins SRS/HLD:
- Account registration/login/logout (JWT) — M1
- Mode selection and duration selection — M2, M3
- Activity selection (exactly one per session) — M4
- Mark activity done + summary storage — M5, M6
- Store session completions and provide 7-day statistics + per-mode counts — M7, S2
- Multiple activities per mode (seeded) — S1
- Responsive frontend (simple SPA) — S3

Tech:
- Node.js, Express
- better-sqlite3 (SQLite) for persistence
- bcryptjs for password hashing, jsonwebtoken for JWT

Quick start:
1. Ensure Node.js 16+ is installed.
2. Install dependencies:
   npm install
3. Seed database and start server:
   npm run start
   (The server will create `littlewins.db` and seed activities if missing.)
4. Open `frontend/index.html` in a browser (or serve it from the `frontend/` folder).

Notes:
- JWT secret currently defaults to `super-secret-dev-key` (for dev only). Use an environment variable `JWT_SECRET` for production.
- For production, run frontend from a proper host and use HTTPS. Replace client-side JWT storage or use httpOnly cookies if needed.
- To extend: implement external activity connectors in `backend/routes/activities.js` and isolate sensor/GPS logic server-side or client-side per HLD.

🛠 Little Wins – Setup nach git pull


✅ Voraussetzungen (wichtig)

Node.js Version: v20 (LTS)

❌ Node 22 / 24 funktioniert nicht zuverlässig mit SQLite

Prüfen:

node -v

📦 Projektstruktur (relevant)
little-wins/
├── backend/
│   ├── db.js        # DB + Migration-light
│   ├── seed.js      # Activities (Upsert)
│   ├── server.js    # Express API
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── home.html
│   ├── activity.html
│   └── config.js


⚠️ Die SQLite-DB (littlewins.db) ist NICHT im Git
→ jede Person hat eine eigene lokale DB.

🚀 Schritt-für-Schritt Setup
1️⃣ Backend vorbereiten
cd backend
npm install

2️⃣ Activities seeden (wichtig!)
node seed.js


💡 seed.js verwendet UPSERT:

fügt neue Activities hinzu

aktualisiert bestehende (z.B. activity_type)

kann jederzeit erneut ausgeführt werden

3️⃣ Backend starten
npm start


Erwartete Ausgabe:

Little Wins API running on http://localhost:3000


⚠️ Dieses Terminal offen lassen!
Wenn es geschlossen wird, funktionieren Login & Registrierung nicht.

4️⃣ Frontend starten

VS Code

Rechtsklick auf frontend/index.html

Open with Live Server

Frontend läuft z. B. unter:

http://127.0.0.1:5500/frontend/index.html

⚙️ config.js überprüfen

Datei: frontend/config.js

window.LW_CONFIG = {
  API_BASE: 'http://127.0.0.1:3000/api'
};


❌ kein localhost
✅ immer 127.0.0.1

🔐 Funktionstest

Seite neu laden (Strg + F5)

Registrieren oder Einloggen

Nach Login erscheint:

Welcome back, <username>!


→ ✅ Setup erfolgreich

🧠 Wichtige Hinweise fürs Team
🔹 Datenbank & Migration

Tabellen werden automatisch in db.js erstellt

Neue Spalten werden per Migration-light ergänzt

Niemand muss die DB löschen

🔹 seed.js (sehr wichtig)

seed.js füllt die Tabelle activities

darf jederzeit ausgeführt werden

erzeugt keine Duplikate






