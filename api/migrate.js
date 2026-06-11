import { getDb } from './_db.js';

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const sql = getDb();

  const results = [];

  const migrations = [
    `CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT DEFAULT '',
      good JSONB DEFAULT '[]', improve JSONB DEFAULT '[]',
      notes JSONB DEFAULT '[]', created BIGINT DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY, title TEXT NOT NULL,
      priority TEXT DEFAULT 'med', status TEXT DEFAULT 'todo',
      deadline TEXT, created BIGINT DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS task_comments (
      id TEXT PRIMARY KEY, task_id TEXT NOT NULL,
      author TEXT DEFAULT 'Me', content TEXT NOT NULL, created BIGINT DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY, task_id TEXT, title TEXT NOT NULL,
      note TEXT DEFAULT '', remind_at TEXT NOT NULL,
      repeat TEXT DEFAULT 'none', done INTEGER DEFAULT 0, created BIGINT DEFAULT 0
    )`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category    TEXT DEFAULT 'personal'`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS bsc         TEXT DEFAULT ''`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS pic         TEXT DEFAULT ''`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated     BIGINT DEFAULT 0`,
    `ALTER TABLE members ADD COLUMN IF NOT EXISTS notes     JSONB DEFAULT '[]'`,
  ];

  for (const m of migrations) {
    try {
      await sql.unsafe(m);
      results.push({ ok: true, sql: m.trim().slice(0, 60) });
    } catch (e) {
      results.push({ ok: false, sql: m.trim().slice(0, 60), error: e.message });
    }
  }

  // Rename comments -> task_comments if old table exists
  try {
    await sql.unsafe(`ALTER TABLE comments RENAME TO task_comments`);
    results.push({ ok: true, sql: 'RENAME comments -> task_comments' });
  } catch (e) {
    results.push({ ok: false, sql: 'RENAME comments (skip if not exists)', error: e.message });
  }

  return res.json({ done: true, results });
}
