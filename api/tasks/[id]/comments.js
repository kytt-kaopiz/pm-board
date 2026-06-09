import { getDb, initSchema } from '../../_db.js';

export default async function handler(req, res) {
  const sql = getDb();
  await initSchema(sql);
  const { id } = req.query;

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM comments WHERE task_id=${id} ORDER BY created ASC`;
    return res.json(rows);
  }

  if (req.method === 'POST') {
    const { id: cid, content, author='Me', created=Date.now() } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Content required' });
    const rows = await sql`
      INSERT INTO comments (id,task_id,author,content,created)
      VALUES (${cid},${id},${author},${content.trim()},${created})
      RETURNING *`;
    return res.json(rows[0]);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
