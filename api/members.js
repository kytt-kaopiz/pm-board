import { getDb, initSchema } from './_db.js';
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  const sql = getDb(); await initSchema(sql);
  if (req.method === 'GET') return res.json(await sql`SELECT * FROM members ORDER BY created ASC`);
  if (req.method === 'POST') {
    const { id, name, role='', good=[], improve=[], notes=[], created=Date.now() } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name required' });
    const rows = await sql`
      INSERT INTO members (id,name,role,good,improve,notes,created)
      VALUES (${id},${name.trim()},${role},${JSON.stringify(good)},${JSON.stringify(improve)},${JSON.stringify(notes)},${created})
      RETURNING *`;
    return res.json(rows[0]);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
