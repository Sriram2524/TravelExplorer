import { WeatherData } from "@/types/destination";

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await fetch(`/api/weather/${lat}/${lon}`);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    // Return fallback weather data
    return {
      temperature: 24,
      condition: "Sunny",
      description: "Clear sky",
      humidity: 65,
      windSpeed: 12,
      icon: "01d"
    };
  }
}
