// Vercel API Route for destinations listing
import { getAllDestinations, getDestinationsByRegion, getDestinationsByTag, searchDestinations } from '../_data/destinations.js';

export default async function handler(req, res) {
  const { method, query: { region, tag, search } } = req;
  
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
    // Handle query parameters for filtering
    let result;
    if (search) {
      result = searchDestinations(search);
    } else if (region) {
      result = getDestinationsByRegion(region);
    } else if (tag) {
      result = getDestinationsByTag(tag);
    } else {
      result = getAllDestinations();
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in destinations API:', error);
    return res.status(500).json({ error: 'Failed to fetch destinations' });
  }
}