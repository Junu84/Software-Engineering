// seed.js — seeds (and updates) activities safely (UPSERT)
const db = require('./db');

const ACTIVITIES = [
  // Mood Booster
  { id: 'm1', mode: 'Mood Booster', title: 'Gratitude mini-list', description: "Write down 3 small things you're grateful for right now.", duration_hints: '3,5', activity_type: 'mood' },
  { id: 'm2', mode: 'Mood Booster', title: 'Dance break', description: 'Put on a song and move for 1 minute—no judgment.', duration_hints: '3,5', activity_type: 'mood' },
  { id: 'm3', mode: 'Mood Booster', title: 'Kind Thought', description: 'Send a short kind message to someone who matters.', duration_hints: '3,5,10', activity_type: 'mood' },

  // Brain Booster
  { id: 'b1', mode: 'Brain Booster', title: 'One quick riddle', description: "Solve this: What has keys but can't open locks? (Answer: Piano).", duration_hints: '3,5', activity_type: 'brain' },
  { id: 'b2', mode: 'Brain Booster', title: 'Mini logic puzzle', description: 'Name 5 animals whose names start with the same letter in 2 minutes.', duration_hints: '5,10', activity_type: 'brain' },
  { id: 'b3', mode: 'Brain Booster', title: 'Memory test', description: 'Try to recall the items in the last shop you visited, list at least 6.', duration_hints: '5,10', activity_type: 'brain' },

  // Relax & Reset
  { id: 'r1', mode: 'Relax & Reset', title: 'Box breathing', description: '4-4-4-4 breathing: inhale- hold-exhale-hold for 4 counts. Repeat for the session.', duration_hints: '3,5,10', activity_type: 'relax' },
  { id: 'r2', mode: 'Relax & Reset', title: 'Grounding', description: 'Name 5 things you can see, 4 you can touch, 3 you can hear.', duration_hints: '3,5', activity_type: 'relax' },
  { id: 'r3', mode: 'Relax & Reset', title: 'Shoulder release', description: 'Slowly roll your shoulders and stretch your neck for a minute.', duration_hints: '3,5,10', activity_type: 'relax' },

  // Kindness & Connection
  { id: 'k1', mode: 'Kindness & Connection', title: 'Compliment someone', description: 'Give a genuine compliment to a person nearby or send one via message.', duration_hints: '3,5', activity_type: 'kindness' },
  { id: 'k2', mode: 'Kindness & Connection', title: 'Tiny favor', description: 'Do one small helpful thing for someone (hold a door, offer directions).', duration_hints: '3,5,10', activity_type: 'kindness' },
  { id: 'k3', mode: 'Kindness & Connection', title: 'Reflect & reach out', description: "Text someone: 'I thought of you — hope you're well.'", duration_hints: '3,5', activity_type: 'kindness' }
];

function seedUpsert() {
  // SQLite UPSERT using ON CONFLICT(id) DO UPDATE
  const upsert = db.prepare(`
    INSERT INTO activities (id, mode, title, description, duration_hints, activity_type)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      mode = excluded.mode,
      title = excluded.title,
      description = excluded.description,
      duration_hints = excluded.duration_hints,
      activity_type = excluded.activity_type
  `);

  const tx = db.transaction((items) => {
    for (const a of items) {
      upsert.run(
        a.id,
        a.mode,
        a.title,
        a.description,
        a.duration_hints || '',
        a.activity_type || 'generic'
      );
    }
  });

  tx(ACTIVITIES);

  const count = db.prepare('SELECT COUNT(*) AS c FROM activities').get().c;
  console.log(`✅ Seed finished. activities count = ${count}`);
}

seedUpsert();