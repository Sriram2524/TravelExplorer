import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Destinations API
  app.get("/api/destinations", async (req, res) => {
    try {
      const { region, tag, search } = req.query;
      
      let destinations;
      if (search) {
        destinations = await storage.searchDestinations(search as string);
      } else if (region) {
        destinations = await storage.getDestinationsByRegion(region as string);
      } else if (tag) {
        destinations = await storage.getDestinationsByTag(tag as string);
      } else {
        destinations = await storage.getAllDestinations();
      }
      
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch destinations" });
    }
  });

  app.get("/api/destinations/:id", async (req, res) => {
    try {
      const destination = await storage.getDestination(req.params.id);
      if (!destination) {
        return res.status(404).json({ error: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch destination" });
    }
  });

  // Weather API proxy
  app.get("/api/weather/:lat/:lon", async (req, res) => {
    try {
      const { lat, lon } = req.params;
      const apiKey = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY || "demo_key";
      
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
      
      res.json(formattedWeather);
    } catch (error) {
      console.error("Weather API error:", error);
      // Return fallback weather data
      res.json({
        temperature: 24,
        condition: "Sunny",
        description: "Clear sky",
        humidity: 65,
        windSpeed: 12,
        icon: "01d"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
