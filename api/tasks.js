import { sql, initSchema } from './_db.js';

export default async function handler(req, res) {
  await initSchema();

  if (req.method === 'GET') {
    const { rows } = await sql`SELECT * FROM tasks ORDER BY created ASC`;
    return res.json(rows);
  }

  if (req.method === 'POST') {
    const { id, title, priority = 'med', status = 'todo', deadline = null, note = '', assignee = '', created = Date.now() } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title required' });
    const { rows } = await sql`
      INSERT INTO tasks (id, title, priority, status, deadline, note, assignee, created)
      VALUES (${id}, ${title.trim()}, ${priority}, ${status}, ${deadline || null}, ${note}, ${assignee}, ${created})
      RETURNING *
    `;
    return res.json(rows[0]);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
