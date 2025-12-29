// activityService.js
function parsePayload(row) {
  if (!row) return row;
  let payload = null;
  try { payload = row.payload ? JSON.parse(row.payload) : null; } catch {}
  return { ...row, payload };
}

function getActivity({ db, mode, duration, excludeId }) {
  const dur = duration ? Number(duration) : null;

  let rows;
  if (dur) {
    rows = db.prepare(`
      SELECT * FROM activities
      WHERE mode = ?
        AND (instr(duration_hints, ?) OR duration_hints = '')
    `).all(mode, String(dur));
  } else {
    rows = db.prepare(`SELECT * FROM activities WHERE mode = ?`).all(mode);
  }

  if (!rows || rows.length === 0) {
    rows = db.prepare(`SELECT * FROM activities WHERE mode = ?`).all(mode);
  }

  // filter out excludeId (frontend "another activity")
  let candidates = rows;
  if (excludeId) candidates = rows.filter(r => r.id !== excludeId);
  if (candidates.length === 0) candidates = rows;

  const selected = candidates[Math.floor(Math.random() * candidates.length)];
  return parsePayload(selected);
}

module.exports = { getActivity };
