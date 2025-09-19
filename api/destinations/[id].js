// Vercel API Route for specific destination
import { getDestination } from '../_data/destinations.js';

export default async function handler(req, res) {
  const { method, query: { id } } = req;
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Handle preflight requests
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const destination = getDestination(id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    return res.status(200).json(destination);
  } catch (error) {
    console.error('Error in destination API:', error);
    return res.status(500).json({ error: 'Failed to fetch destination' });
  }
}