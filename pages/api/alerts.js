import { getAlerts } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const alerts = await getAlerts();
      res.status(200).json(alerts);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}