import { sql, initSchema } from '../_db.js';

export default async function handler(req, res) {
  await initSchema();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { rows: ex } = await sql`SELECT * FROM members WHERE id = ${id}`;
    if (!ex[0]) return res.status(404).json({ error: 'Not found' });
    const e = ex[0];
    const { name, role, good, improve } = req.body;
    const { rows } = await sql`
      UPDATE members SET
        name    = ${name    ?? e.name},
        role    = ${role    !== undefined ? role    : e.role},
        good    = ${good    !== undefined ? JSON.stringify(good)    : e.good},
        improve = ${improve !== undefined ? JSON.stringify(improve) : e.improve}
      WHERE id = ${id} RETURNING *
    `;
    return res.json(rows[0]);
  }

  if (req.method === 'DELETE') {
    const { rows } = await sql`SELECT id FROM members WHERE id = ${id}`;
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    await sql`UPDATE tasks SET assignee = '' WHERE assignee = ${id}`;
    await sql`DELETE FROM members WHERE id = ${id}`;
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
