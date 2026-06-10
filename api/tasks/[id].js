import { getDb, initSchema } from '../_db.js';
export default async function handler(req, res) {
  const sql = getDb(); await initSchema(sql);
  const { id } = req.query;
  if (req.method === 'PUT') {
    const ex = (await sql`SELECT * FROM tasks WHERE id=${id}`)[0];
    if (!ex) return res.status(404).json({ error: 'Not found' });
    const { title, description, priority, status, category, bsc, deadline, pic } = req.body;
    const rows = await sql`
      UPDATE tasks SET
        title=${title??ex.title}, description=${description??ex.description},
        priority=${priority??ex.priority}, status=${status??ex.status},
        category=${category??ex.category}, bsc=${bsc??ex.bsc},
        deadline=${deadline!==undefined?(deadline||null):ex.deadline},
        pic=${pic??ex.pic}, updated=${Date.now()}
      WHERE id=${id} RETURNING *`;
    return res.json(rows[0]);
  }
  if (req.method === 'DELETE') {
    await sql`DELETE FROM task_comments WHERE task_id=${id}`;
    await sql`DELETE FROM tasks WHERE id=${id}`;
    return res.json({ ok: true });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
