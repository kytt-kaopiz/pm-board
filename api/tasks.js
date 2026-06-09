import { getDb, initSchema } from './_db.js';

export default async function handler(req, res) {
  const sql = getDb();
  await initSchema(sql);

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM tasks ORDER BY created DESC`;
    return res.json(rows);
  }

  if (req.method === 'POST') {
    const { id, title, description='', priority='med', status='todo',
            category='personal', bsc='', deadline=null, pic='', created=Date.now() } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title required' });
    const rows = await sql`
      INSERT INTO tasks (id,title,description,priority,status,category,bsc,deadline,pic,created,updated)
      VALUES (${id},${title.trim()},${description},${priority},${status},${category},${bsc},${deadline||null},${pic},${created},${created})
      RETURNING *`;
    return res.json(rows[0]);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
