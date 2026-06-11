import { getDb, initSchema } from '../_db.js';
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  const sql = getDb(); await initSchema(sql);
  const { id } = req.query;
  if (req.method === 'PUT') {
    const ex = (await sql`SELECT * FROM reminders WHERE id=${id}`)[0];
    if (!ex) return res.status(404).json({ error: 'Not found' });
    const { title, note, remind_at, repeat, done, task_id } = req.body;
    const rows = await sql`
      UPDATE reminders SET
        title=${title??ex.title}, note=${note!==undefined?note:ex.note},
        remind_at=${remind_at??ex.remind_at}, repeat=${repeat??ex.repeat},
        done=${done!==undefined?done:ex.done},
        task_id=${task_id!==undefined?task_id:ex.task_id}
      WHERE id=${id} RETURNING *`;
    return res.json(rows[0]);
  }
  if (req.method === 'DELETE') {
    await sql`DELETE FROM reminders WHERE id=${id}`;
    return res.json({ ok: true });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
