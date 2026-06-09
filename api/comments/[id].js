import { getDb } from '../_db.js';

export default async function handler(req, res) {
  const sql = getDb();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    await sql`DELETE FROM comments WHERE id=${id}`;
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
