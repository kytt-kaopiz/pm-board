import { neon } from '@neondatabase/serverless';

export function getDb() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('No DATABASE_URL found');
  return neon(url);
}

export async function initSchema(sql) {
  // Create tables
  try { await sql`CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT DEFAULT '',
    good JSONB DEFAULT '[]', improve JSONB DEFAULT '[]',
    notes JSONB DEFAULT '[]', created BIGINT DEFAULT 0
  )`; } catch (_) {}

  try { await sql`CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT DEFAULT '',
    priority TEXT DEFAULT 'med', status TEXT DEFAULT 'todo',
    category TEXT DEFAULT 'personal', bsc TEXT DEFAULT '',
    deadline TEXT, pic TEXT DEFAULT '',
    created BIGINT DEFAULT 0, updated BIGINT DEFAULT 0
  )`; } catch (_) {}

  try { await sql`CREATE TABLE IF NOT EXISTS task_comments (
    id TEXT PRIMARY KEY, task_id TEXT NOT NULL,
    author TEXT DEFAULT 'Me', content TEXT NOT NULL, created BIGINT DEFAULT 0
  )`; } catch (_) {}

  try { await sql`CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY, task_id TEXT, title TEXT NOT NULL,
    note TEXT DEFAULT '', remind_at TEXT NOT NULL,
    repeat TEXT DEFAULT 'none', done INTEGER DEFAULT 0, created BIGINT DEFAULT 0
  )`; } catch (_) {}

  // Always run migrations — safe to run multiple times
  const migrations = [
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category    TEXT DEFAULT 'personal'`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS bsc         TEXT DEFAULT ''`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS pic         TEXT DEFAULT ''`,
    `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated     BIGINT DEFAULT 0`,
    `ALTER TABLE members ADD COLUMN IF NOT EXISTS notes     JSONB DEFAULT '[]'`,
    `ALTER TABLE comments RENAME TO task_comments`,
  ];
  for (const m of migrations) {
    try { await sql.unsafe(m); } catch (_) {}
  }
}
