export async function handler(event, context) {
  const { httpMethod, path } = event;
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
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
    // Extract lat and lon from path
    const pathParts = path.split('/');
    const lat = pathParts[pathParts.length - 2];
    const lon = pathParts[pathParts.length - 1];
    
    if (!lat || !lon) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Latitude and longitude are required' }),
      };
    }

    const apiKey = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY;
    
    // If no API key is configured, return fallback data immediately
    if (!apiKey || apiKey === "demo_key") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          temperature: 24,
          condition: "Sunny",
          description: "Clear sky",
          humidity: 65,
          windSpeed: 12,
          icon: "01d"
        }),
      };
    }
      
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
      
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
      
    const weatherData = await response.json();
      
    const formattedWeather = {
      temperature: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
      icon: weatherData.weather[0].icon
    };
      
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(formattedWeather),
    };
  } catch (error) {
    console.error("Weather API error:", error);
    // Return fallback weather data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        temperature: 24,
        condition: "Sunny",
        description: "Clear sky",
        humidity: 65,
        windSpeed: 12,
        icon: "01d"
      }),
    };
  }
}