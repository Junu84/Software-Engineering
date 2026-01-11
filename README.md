# 🌸 Little Wins — Meaningful Micro‑Moments App

Little Wins helps users turn short waiting periods into small, positive moments instead of passive doomscrolling. The app suggests short activities based on mood, intention and available time and stores session completions & statistics.

---

## 🚀 Quick overview

- Simple multipage frontend (HTML/CSS/JS)
- Backend: Node.js + Express REST API
- Persistence: SQLite (better-sqlite3)
- Auth: JWT-based (development default; use a secure secret in production)

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

- Node.js v16+ (v20 works well for development)
- npm (comes with Node)
- Recommended (Windows) — use PowerShell or WSL when installing native modules

Note: the SQLite DB (`littlewins.db`) is not committed — every contributor will have a local copy.

---

## ▶️ Quick start (development)

Run these commands from the repository root. Use one command per line.

1. Install backend deps
```bash
cd backend
npm install
```

2. Seed activities (idempotent; safe to re-run)
```bash
node seed.js
# Output: "Seed finished. activities count = N"
```

3. Start backend
```bash
npm run start
# Expected: "Little Wins API running on http://localhost:3000"
```

4. Serve frontend (from repo root or inside `frontend/`)
Option A — http-server (recommended):
```bash
cd frontend
npx http-server ./ -p 5500
# Open: http://127.0.0.1:5500/index.html
```

Option B — VS Code Live Server:
- Right‑click `frontend/index.html` → Open with Live Server

Important: use 127.0.0.1 for API_BASE in `frontend/config.js` (not `localhost`) to avoid ambiguous behavior in some environments:
```js
// frontend/config.js
window.LW_CONFIG = {
  API_BASE: 'http://127.0.0.1:3000/api'
};
```

---

## ⚙️ Environment variables

For development a default JWT secret is used. For any deployment or shared test environment, set:

- `JWT_SECRET` — secret for signing JWTs
- `PORT` — optional; backend reads process.env.PORT if set

Example (PowerShell):
```powershell
$env:JWT_SECRET="your-dev-secret"
$env:PORT="3001"
npm run start
```

---

## 📁 Where things live (relevant files)

```
little-wins/
├─ backend/
│  ├─ server.js
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

Archived SPA script (kept for reference):
- `frontend/archived/app-spa-archived.js` — do not include this file in active pages.

---

## 🧪 Manual testing checklist (smoke test)

1. Start backend (see above).
2. Serve frontend and open: http://127.0.0.1:5500/index.html
3. Register a user (index page) → confirm `lw_token` in localStorage.
4. Login → navigate to home → start a session (choose mode & duration).
5. Activity page → mark it Done → verify session is saved.
6. Open Stats → confirm sessions count and per‑mode counts reflect saved sessions.

Watch DevTools → Network and Console for API calls and errors. Also watch the backend terminal for incoming request logs.

---

## 🛠 Troubleshooting

- EADDRINUSE (port 3000): another process uses the port. Either stop the process or run backend with a different `PORT`.
- better-sqlite3 / native build errors (Windows): install Visual C++ Build Tools or use WSL for easier native module builds.
- 401 Unauthorized: ensure backend is running and that `lw_token` exists in localStorage after login.
- CORS issues: backend is configured for local development; if the browser blocks requests check console errors and backend logs.

---

## 🧾 Contributing & workflow

- Create a feature branch `fix/...` or `feat/...`.
- Open PR against `main`. Keep PR descriptions concise and include testing steps.
- After merging, delete the feature branch (GitHub offers a one‑click button).
- Keep `README.md` updated with major developer setup changes.

---

## ♻️ Housekeeping decisions (current repo)

- The multipage frontend (index/home/activity/stats) is the canonical UI.
- The prior SPA script has been archived at `frontend/archived/app-spa-archived.js` to avoid accidental loading.
- Consider removing the archived file later if you are confident it won’t be reused.

---

## 🇩🇪 Kurzanleitung (Windows / PowerShell)

1. Backend:
```powershell
cd backend
npm install
node seed.js
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






