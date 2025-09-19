import { getAllDestinations, getDestination, getDestinationsByRegion, getDestinationsByTag, searchDestinations } from './storage.js';

export async function handler(event, context) {
  const { httpMethod, path, queryStringParameters } = event;
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Extract destination ID from path if present
    const pathParts = path.split('/');
    const destinationId = pathParts[pathParts.length - 1];
    
    // Check if this is a request for a specific destination
    if (destinationId && destinationId !== 'destinations' && destinationId.length > 0) {
      const destination = getDestination(destinationId);
      if (!destination) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Destination not found' }),
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(destination),
      };
    }

    // Handle query parameters for filtering
    const { region, tag, search } = queryStringParameters || {};
    
    let destinations;
    if (search) {
      destinations = searchDestinations(search);
    } else if (region) {
      destinations = getDestinationsByRegion(region);
    } else if (tag) {
      destinations = getDestinationsByTag(tag);
    } else {
      destinations = getAllDestinations();
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(destinations),
    };
  } catch (error) {
    console.error('Error in destinations function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch destinations' }),
    };
  }
}