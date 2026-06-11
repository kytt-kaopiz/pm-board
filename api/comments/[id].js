import { getDb } from '../_db.js';
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  const sql = getDb();
  if (req.method === 'DELETE') {
    await sql`DELETE FROM task_comments WHERE id=${req.query.id}`;
    return res.json({ ok: true });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
