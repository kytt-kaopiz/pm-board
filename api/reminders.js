import { getDb, initSchema } from './_db.js';
export default async function handler(req, res) {
  const sql = getDb(); await initSchema(sql);
  if (req.method === 'GET') return res.json(await sql`SELECT * FROM reminders ORDER BY remind_at ASC`);
  if (req.method === 'POST') {
    const { id, task_id=null, title, note='', remind_at, repeat='none', created=Date.now() } = req.body;
    if (!title?.trim() || !remind_at) return res.status(400).json({ error: 'Title and remind_at required' });
    const rows = await sql`
      INSERT INTO reminders (id,task_id,title,note,remind_at,repeat,done,created)
      VALUES (${id},${task_id||null},${title.trim()},${note},${remind_at},${repeat},${0},${created})
      RETURNING *`;
    return res.json(rows[0]);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
