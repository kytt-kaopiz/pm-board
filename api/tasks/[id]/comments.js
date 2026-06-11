import { getDb, initSchema } from '../../_db.js';
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  const sql = getDb(); await initSchema(sql);
  const { id } = req.query;
  if (req.method === 'GET') {
    return res.json(await sql`SELECT * FROM task_comments WHERE task_id=${id} ORDER BY created ASC`);
  }
  if (req.method === 'POST') {
    const { id: cid, content, author='Me', created=Date.now() } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Content required' });
    const rows = await sql`
      INSERT INTO task_comments (id,task_id,author,content,created)
      VALUES (${cid},${id},${author},${content.trim()},${created}) RETURNING *`;
    return res.json(rows[0]);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
