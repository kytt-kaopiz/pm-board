import { sql, initSchema } from '../_db.js';

export default async function handler(req, res) {
  await initSchema();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { rows: ex } = await sql`SELECT * FROM tasks WHERE id = ${id}`;
    if (!ex[0]) return res.status(404).json({ error: 'Not found' });
    const e = ex[0];
    const { title, priority, status, deadline, note, assignee } = req.body;
    const { rows } = await sql`
      UPDATE tasks SET
        title    = ${title    ?? e.title},
        priority = ${priority ?? e.priority},
        status   = ${status   ?? e.status},
        deadline = ${deadline !== undefined ? (deadline || null) : e.deadline},
        note     = ${note     !== undefined ? note     : e.note},
        assignee = ${assignee !== undefined ? assignee : e.assignee}
      WHERE id = ${id} RETURNING *
    `;
    return res.json(rows[0]);
  }

  if (req.method === 'DELETE') {
    const { rows } = await sql`SELECT id FROM tasks WHERE id = ${id}`;
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    await sql`DELETE FROM tasks WHERE id = ${id}`;
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
