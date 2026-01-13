# 🌸 Little Wins — Meaningful Micro‑Moments App

Little Wins helps users turn short waiting periods into small, positive moments instead of passive doomscrolling. The app suggests short activities based on mood, intention and available time and stores session completions & statistics.

---

## 🚀 Quick overview

- Simple multipage frontend (HTML/CSS/JS)
- Backend: Node.js + Express REST API
- Persistence: SQLite (better-sqlite3)
- Auth: JWT-based (server requires `JWT_SECRET`)

---

## 🎯 Core MVP features

- User registration & login (JWT)
- Mode selection: Mood Booster, Brain Booster, Relax & Reset, Kindness & Connection
- Duration selection: 3, 5, 10, 15 minutes
- Single activity per session, mark done and store summary
- 7‑day session stats + per‑mode counts

---

## 🧰 Tech stack

- Frontend: HTML, CSS, plain JS (multipage)
- Backend: Node.js, Express
- DB: SQLite (better-sqlite3)
- Auth & security: bcryptjs, jsonwebtoken

---

## ✅ Prerequisites

- Node.js v16+ (v20 used in development)
- npm (bundled with Node)
- Recommended on Windows: use PowerShell or WSL for installing native modules (better-sqlite3)

Note: the SQLite DB (`littlewins.db`) is not committed — each contributor will have a local copy created by the seed script.

---

## ⚙️ Environment variables (important)

We keep example environment variables in `.env.example` at the repository root. Do NOT commit a real `.env` file.

Required environment variables:
- `JWT_SECRET` — secret used to sign JWTs. The backend will exit at startup if this is missing.
Optional:
- `PORT` — port for the backend (defaults to `3000` if not set)
- `DB_PATH` — optional DB path (default `./littlewins.db`)

Example `.env.example` (already present in repo root):
```
JWT_SECRET=super-secret-dev-key
PORT=3000
DB_PATH=./littlewins.db
```

Create a local `.env` for development (do not commit it):
- PowerShell (repo root):
```powershell
Copy-Item .env.example backend\.env
notepad backend\.env   # edit JWT_SECRET -> set a real dev secret, save & close
```

- Bash / WSL:
```bash
cp .env.example backend/.env
$EDITOR backend/.env   # edit JWT_SECRET -> set a real dev secret, save
```

We intentionally require `JWT_SECRET` at server startup (no insecure fallback). If `JWT_SECRET` is missing the server will exit with a clear error.

---

## ▶️ Quick start (development)

Run each command from the repository root (one line at a time).

1) Install backend deps
```bash
cd backend
npm install
```

2) Seed activities (creates local DB and records)
```bash
node seed.js
# Expected output: "Seed finished. activities count = N"
```

3) Start backend
- If you created `backend/.env` the server will load it automatically (via dotenv).
- Or set env vars for the session:

PowerShell:
```powershell
# session-only
$env:JWT_SECRET = "your-dev-secret"
$env:PORT = "3000"     # optional
npm run start
```

Bash / WSL:
```bash
export JWT_SECRET='your-dev-secret'
export PORT=3000       # optional
npm run start
```

Expected log: `Little Wins API running on http://localhost:3000` (or port you set).

4) Serve frontend
Option A — use http-server (recommended):
```bash
cd frontend
npx http-server ./ -p 5500
# Open: http://127.0.0.1:5500/index.html
```

Option B — use VS Code Live Server:
- Right‑click `frontend/index.html` → Open with Live Server

Important: use `127.0.0.1` for the API base in `frontend/config.js` to avoid ambiguous behavior on certain Windows environments. Example:
```js
// frontend/config.js
window.LW_CONFIG = {
  API_BASE: 'http://127.0.0.1:3000/api'
};
```

---

## 🧪 Acceptance / smoke tests

A simple PowerShell acceptance script (`test-acceptance.ps1`) can run the register/login/fetch flows. To run it against your local backend:

```powershell
# Point the script to local API
$env:API_BASE = 'http://localhost:3000/api'
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\test-acceptance.ps1
```

If you want to run with an existing test account:
```powershell
$env:TEST_EMAIL='you@example.com'
$env:TEST_PASSWORD='YourPassword'
$env:API_BASE='http://localhost:3000/api'
.\test-acceptance.ps1
```

If any step fails, the script output shows the failing HTTP request and error text. Useful to debug 401/403 or connection issues.

---

## 📁 Project layout

```
little-wins/
├─ backend/
│  ├─ server.js       # main server (loads dotenv, requires JWT_SECRET)
│  ├─ db.js
│  ├─ seed.js
│  └─ package.json
└─ frontend/
   ├─ index.html
   ├─ home.html
   ├─ activity.html
   ├─ stats.html
   └─ config.js
```

---

## ▶️ Manual testing checklist (smoke test)

1. Start backend (see Quick start).
2. Serve frontend and open: http://127.0.0.1:5500/index.html
3. Register a user and confirm `lw_token` is stored in localStorage.
4. Login, start a session, mark Done, and confirm session saved.
5. Open Stats and verify counts.

Watch DevTools → Network and Console for API calls and errors. Also watch the backend console for request logs.

---

## 🛠 Troubleshooting (common issues)

- EADDRINUSE (port 3000): another process uses the port. Stop it or run backend with a different `PORT`:
  PowerShell example: `$env:PORT=3001; npm run start`

- 401 Unauthorized: ensure backend is running and that `lw_token` exists in localStorage after login.

- CORS issues: backend is configured for local development. If the browser blocks requests, check console errors and backend logs.

- better-sqlite3 native build errors (Windows): install Visual C++ Build Tools or use WSL to install native dependencies.

---

## ♻️ Git / security notes

- `.env.example` is committed to document required env vars.
- `backend/.env` must NOT be committed. The project `.gitignore` includes `backend/.env`.
- If you accidentally commit secrets, rotate them and remove the tracked file from repo history (ask for help if this happens).

---

## 🧾 Contributing & workflow

- Create a feature branch `feat/...` or `fix/...`.
- Open a PR against `main` and include testing steps.
- After merge, delete the feature branch.

---

## 🇩🇪 Kurzanleitung (Windows / PowerShell)

1. Backend:
```powershell
cd backend
npm install
node seed.js
# create backend/.env from .env.example and edit JWT_SECRET
npm run start
```

2. Frontend:
```powershell
cd frontend
npx http-server ./ -p 5500
# Open http://127.0.0.1:5500/index.html
```

---

## 🙋‍♀️ Maintainers / Team

- Theresa Hartmann
- Junu Rahman
- Arooj Shahzadi

---