import { neon } from '@neondatabase/serverless';

export function getDb() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('No DATABASE_URL found');
  return neon(url);
}

export async function initSchema(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS members (
      id       TEXT PRIMARY KEY,
      name     TEXT NOT NULL,
      role     TEXT DEFAULT '',
      good     JSONB DEFAULT '[]',
      improve  JSONB DEFAULT '[]',
      notes    JSONB DEFAULT '[]',
      created  BIGINT DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT DEFAULT '',
      priority    TEXT DEFAULT 'med',
      status      TEXT DEFAULT 'todo',
      category    TEXT DEFAULT 'personal',
      bsc         TEXT DEFAULT '',
      deadline    TEXT,
      pic         TEXT DEFAULT '',
      created     BIGINT DEFAULT 0,
      updated     BIGINT DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id       TEXT PRIMARY KEY,
      task_id  TEXT NOT NULL,
      author   TEXT DEFAULT 'Me',
      content  TEXT NOT NULL,
      created  BIGINT DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS reminders (
      id        TEXT PRIMARY KEY,
      task_id   TEXT,
      title     TEXT NOT NULL,
      note      TEXT DEFAULT '',
      remind_at TEXT NOT NULL,
      repeat    TEXT DEFAULT 'none',
      done      INTEGER DEFAULT 0,
      created   BIGINT DEFAULT 0
    )
  `;
}
