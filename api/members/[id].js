import { getDb, initSchema } from '../_db.js';
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  const sql = getDb(); await initSchema(sql);
  const { id } = req.query;
  if (req.method === 'PUT') {
    const ex = (await sql`SELECT * FROM members WHERE id=${id}`)[0];
    if (!ex) return res.status(404).json({ error: 'Not found' });
    const { name, role, good, improve, notes } = req.body;
    const rows = await sql`
      UPDATE members SET
        name=${name??ex.name}, role=${role!==undefined?role:ex.role},
        good=${good!==undefined?JSON.stringify(good):ex.good},
        improve=${improve!==undefined?JSON.stringify(improve):ex.improve},
        notes=${notes!==undefined?JSON.stringify(notes):ex.notes}
      WHERE id=${id} RETURNING *`;
    return res.json(rows[0]);
  }
  if (req.method === 'DELETE') {
    await sql`UPDATE tasks SET pic='' WHERE pic=${id}`;
    await sql`DELETE FROM members WHERE id=${id}`;
    return res.json({ ok: true });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
