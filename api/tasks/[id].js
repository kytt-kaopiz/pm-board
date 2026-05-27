import { getDb, initSchema } from '../_db.js';

export default async function handler(req, res) {
  const sql = getDb();
  await initSchema(sql);
  const { id } = req.query;

  if (req.method === 'PUT') {
    const ex = (await sql`SELECT * FROM tasks WHERE id=${id}`)[0];
    if (!ex) return res.status(404).json({ error: 'Not found' });
    const { title, priority, status, deadline, note, assignee, category } = req.body;
    const rows = await sql`
      UPDATE tasks SET
        title=${title??ex.title}, priority=${priority??ex.priority},
        status=${status??ex.status},
        deadline=${deadline!==undefined?(deadline||null):ex.deadline},
        note=${note!==undefined?note:ex.note},
        assignee=${assignee!==undefined?assignee:ex.assignee},
        category=${category!==undefined?category:ex.category}
      WHERE id=${id} RETURNING *
    `;
    return res.json(rows[0]);
  }

  if (req.method === 'DELETE') {
    const ex = (await sql`SELECT id FROM tasks WHERE id=${id}`)[0];
    if (!ex) return res.status(404).json({ error: 'Not found' });
    await sql`DELETE FROM tasks WHERE id=${id}`;
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
