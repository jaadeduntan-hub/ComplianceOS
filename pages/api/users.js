import { getEndUsers } from '@/lib/airtable';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const users = await getEndUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}