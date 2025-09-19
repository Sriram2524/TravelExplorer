// Vercel API Route for weather with dynamic lat/lon
export default async function handler(req, res) {
  const { method, query: { params } } = req;
  
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

  // Extract lat and lon from params array
  const [lat, lon] = params || [];
  
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY;
    
    // If no API key is configured, return fallback data immediately
    if (!apiKey || apiKey === "demo_key") {
      return res.status(200).json({
        temperature: 24,
        condition: "Sunny",
        description: "Clear sky",
        humidity: 65,
        windSpeed: 12,
        icon: "01d"
      });
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
      
    return res.status(200).json(formattedWeather);
  } catch (error) {
    console.error("Weather API error:", error);
    // Return fallback weather data
    return res.status(200).json({
      temperature: 24,
      condition: "Sunny",
      description: "Clear sky",
      humidity: 65,
      windSpeed: 12,
      icon: "01d"
    });
  }
}