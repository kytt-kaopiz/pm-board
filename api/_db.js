import { neon } from '@neondatabase/serverless';

export function getDb() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('No DATABASE_URL found');
  return neon(url);
}

export async function initSchema(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'med',
      status TEXT NOT NULL DEFAULT 'todo',
      deadline TEXT,
      note TEXT DEFAULT '',
      assignee TEXT DEFAULT '',
      created BIGINT DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT DEFAULT '',
      good JSONB DEFAULT '[]',
      improve JSONB DEFAULT '[]',
      created BIGINT DEFAULT 0
    )
  `;
}
