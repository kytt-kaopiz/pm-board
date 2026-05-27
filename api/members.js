import { sql, initSchema } from './_db.js';

export default async function handler(req, res) {
  await initSchema();

  if (req.method === 'GET') {
    const { rows } = await sql`SELECT * FROM members ORDER BY created ASC`;
    return res.json(rows);
  }

  if (req.method === 'POST') {
    const { id, name, role = '', good = [], improve = [], created = Date.now() } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name required' });
    const { rows } = await sql`
      INSERT INTO members (id, name, role, good, improve, created)
      VALUES (${id}, ${name.trim()}, ${role}, ${JSON.stringify(good)}, ${JSON.stringify(improve)}, ${created})
      RETURNING *
    `;
    return res.json(rows[0]);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
