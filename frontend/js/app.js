// frontend/app-frontend.js — minimal SPA logic to call the backend API
const API_BASE = window.LW_CONFIG?.API_BASE || 'http://localhost:3000/api';

function setToken(token) { localStorage.setItem('lw_token', token); }
function getToken() { return localStorage.getItem('lw_token'); }
function clearToken(){ localStorage.removeItem('lw_token'); }

async function api(path, opts = {}) {
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + path, { ...opts, headers });
  if (res.status === 401) { logoutUI(); throw new Error('Unauthorized'); }
  return res.json();
}

// DOM
const authSection = document.getElementById('auth');
const homeSection = document.getElementById('home');
const statsSection = document.getElementById('stats');
const navLogout = document.getElementById('nav-logout');
const navHome = document.getElementById('nav-home');
const navStats = document.getElementById('nav-stats');

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const welcomeEl = document.getElementById('welcome');

const startBtn = document.getElementById('start');
const activityEl = document.getElementById('activity');
const activityCard = document.getElementById('activity-card');
const activityMode = document.getElementById('activity-mode');
const anotherBtn = document.getElementById('another');
const doneBtn = document.getElementById('done');

const summaryEl = document.getElementById('summary');
const summaryDetails = document.getElementById('summary-details');
const photoBtn = document.getElementById('photo-btn');
const photoInput = document.getElementById('photo-input');
const toHomeBtn = document.getElementById('to-home');

let currentActivity = null;
let currentSession = null;

function showAuth(){ authSection.classList.remove('hidden'); homeSection.classList.add('hidden'); statsSection.classList.add('hidden'); navLogout.classList.add('hidden'); }
function showHome(){ authSection.classList.add('hidden'); homeSection.classList.remove('hidden'); statsSection.classList.add('hidden'); navLogout.classList.remove('hidden'); }
function showStats(){ authSection.classList.add('hidden'); homeSection.classList.add('hidden'); statsSection.classList.remove('hidden'); navLogout.classList.remove('hidden'); }

function logoutUI(){ clearToken(); showAuth(); }

registerForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('reg-email').value;
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;
  try {
    const res = await api('/register', { method: 'POST', body: JSON.stringify({ email, username, password }) });
    if (res.token) { setToken(res.token); loadMe(); showHome(); }
  } catch (err) { alert(err.message || 'Register failed'); }
});

loginForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const identity = document.getElementById('login-identity').value;
  const password = document.getElementById('login-password').value;
  try {
    const res = await api('/login', { method: 'POST', body: JSON.stringify({ identity, password }) });
    if (res.token) { setToken(res.token); loadMe(); showHome(); }
  } catch (err) { alert(err.message || 'Login failed'); }
});

navLogout.addEventListener('click', ()=> logoutUI());
navHome.addEventListener('click', ()=> showHome());
navStats.addEventListener('click', async () => { await renderStats(); showStats(); });

async function loadMe(){
  try {
    const r = await api('/me');
    welcomeEl.textContent = `Welcome, ${r.user.username}! Choose a mode and duration.`;
  } catch (err) { showAuth(); }
}

startBtn.addEventListener('click', async (e)=>{
  e.preventDefault();
  const modeInput = document.querySelector('input[name="mode"]:checked');
  const durInput = document.querySelector('input[name="duration"]:checked');
  if (!modeInput || !durInput) return alert('Select mode and duration');
  const mode = modeInput.value;
  const duration = Number(durInput.value);
  // request activity from API
  const res = await api(`/activities?mode=${encodeURIComponent(mode)}&duration=${duration}`);
  currentActivity = res.activity;
  currentSession = { mode, duration, activityId: currentActivity.id, activityTitle: currentActivity.title, startedAt: new Date().toISOString() };
  showActivity();
});

function showActivity(){
  activityMode.textContent = `${currentSession.mode} — ${currentSession.duration} min`;
  activityCard.innerHTML = `<strong>${currentActivity.title}</strong><p>${currentActivity.description}</p>`;
  activityEl.classList.remove('hidden');
  summaryEl.classList.add('hidden');
}

anotherBtn.addEventListener('click', async ()=>{
  if (!currentSession) return;
  const res = await api(`/activities?mode=${encodeURIComponent(currentSession.mode)}&duration=${currentSession.duration}&excludeId=${currentActivity.id}`);
  currentActivity = res.activity;
  currentSession.activityId = currentActivity.id;
  currentSession.activityTitle = currentActivity.title;
  showActivity();
});

doneBtn.addEventListener('click', async ()=>{
  if (!currentSession) return;
  currentSession.completedAt = new Date().toISOString();
  // POST to /api/sessions
  const res = await api('/sessions', { method: 'POST', body: JSON.stringify(currentSession) });
  showSummary(res.session);
});

function showSummary(session){
  activityEl.classList.add('hidden');
  summaryEl.classList.remove('hidden');
  summaryDetails.innerHTML = '';
  const p1 = document.createElement('p'); p1.textContent = `Mode: ${session.mode} • Duration: ${session.duration} min`;
  const p2 = document.createElement('p'); p2.textContent = `Activity: ${session.activity_title}`;
  const p3 = document.createElement('p'); p3.textContent = `Completed: ${new Date(session.completed_at).toLocaleString()}`;
  summaryDetails.appendChild(p1); summaryDetails.appendChild(p2); summaryDetails.appendChild(p3);
  if (session.photo) {
    const img = document.createElement('img'); img.src = session.photo; img.style.maxWidth='100%';
    summaryDetails.appendChild(img);
  }
  const msg = ['Nice! A little win adds up.','Great job — celebrate the moment!'][Math.floor(Math.random()*2)];
  const pm = document.createElement('p'); pm.style.color='#10b981'; pm.textContent = msg;
  summaryDetails.appendChild(pm);
}

photoBtn.addEventListener('click', ()=> photoInput.click());

photoInput.addEventListener('change', async (e)=>{
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = async function(ev){
    const dataUrl = ev.target.result;
    // attach photo and update session (send new session completion with photo)
    currentSession.completedAt = new Date().toISOString();
    currentSession.photo = dataUrl;
    const res = await api('/sessions', { method: 'POST', body: JSON.stringify(currentSession) });
    showSummary(res.session);
  };
  reader.readAsDataURL(f);
});

toHomeBtn.addEventListener('click', ()=> {
  summaryEl.classList.add('hidden');
  activityEl.classList.add('hidden');
  showHome();
});

async function renderStats(){
  try {
    const res = await api('/sessions/stats');
    // days chart simple
    const chart = document.getElementById('chart');
    chart.innerHTML = '';
    const max = Math.max(1, ...res.days.map(d => d.count));
    const container = document.createElement('div'); container.style.display='flex'; container.style.gap='8px';
    res.days.forEach(d=>{
      const col = document.createElement('div'); col.style.flex='1'; col.style.textAlign='center';
      const bar = document.createElement('div'); bar.style.height = `${Math.round((d.count/max)*120)}px`;
      bar.style.background = 'linear-gradient(180deg,#3b82f6,#60a5fa)'; bar.style.borderRadius='6px';
      const label = document.createElement('div'); label.textContent = d.label.split(',')[0];
      const count = document.createElement('div'); count.textContent = d.count;
      col.appendChild(bar); col.appendChild(count); col.appendChild(label);
      container.appendChild(col);
    });
    chart.appendChild(container);

    const modeDiv = document.getElementById('mode-dist'); modeDiv.innerHTML = '<h3>Sessions by mode</h3>';
    const ul = document.createElement('ul');
    Object.entries(res.modeCounts).forEach(([m,c]) => { const li = document.createElement('li'); li.textContent = `${m}: ${c}`; ul.appendChild(li); });
    modeDiv.appendChild(ul);
  } catch (err) { alert('Could not load stats'); }
}

// On load, try load me
(async function init(){
  if (getToken()) {
    try { await loadMe(); showHome(); } catch (e) { showAuth(); }
  } else showAuth();
})();