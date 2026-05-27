import { getDb, initSchema } from './_db.js';

export default async function handler(req, res) {
  const sql = getDb();
  await initSchema(sql);

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM tasks ORDER BY created ASC`;
    return res.json(rows);
  }

  if (req.method === 'POST') {
    const { id, title, priority='med', status='todo', deadline=null, note='', assignee='', category='personal', created=Date.now() } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title required' });
    const rows = await sql`
      INSERT INTO tasks (id,title,priority,status,deadline,note,assignee,category,created)
      VALUES (${id},${title.trim()},${priority},${status},${deadline||null},${note},${assignee},${category},${created})
      RETURNING *
    `;
    return res.json(rows[0]);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
