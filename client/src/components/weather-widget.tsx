import { useQuery } from "@tanstack/react-query";
import { Sun, Droplets, Wind } from "lucide-react";
import { fetchWeather } from "@/lib/weather";
import { WeatherData } from "@/types/destination";

interface WeatherWidgetProps {
  latitude: number;
  longitude: number;
  destinationName: string;
}

export default function WeatherWidget({ latitude, longitude, destinationName }: WeatherWidgetProps) {
  const { data: weather, isLoading } = useQuery<WeatherData>({
    queryKey: ["weather", latitude, longitude],
    queryFn: () => fetchWeather(latitude, longitude),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  if (isLoading) {
    return (
      <div className="weather-widget text-white p-6 rounded-lg" data-testid="weather-widget-loading">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Sun className="mr-2 h-5 w-5" />
          Current Weather
        </h3>
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded mb-2"></div>
            <div className="h-4 bg-white/20 rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-8 bg-white/20 rounded"></div>
              <div className="h-8 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-widget text-white p-6 rounded-lg" data-testid="weather-widget-error">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Sun className="mr-2 h-5 w-5" />
          Weather Unavailable
        </h3>
        <p className="text-center opacity-80">
          Unable to load weather data for {destinationName}
        </p>
      </div>
    );
  }

  return (
    <div className="weather-widget text-white p-6 rounded-lg" data-testid="weather-widget">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Sun className="mr-2 h-5 w-5" />
        Current Weather
      </h3>
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" data-testid="text-temperature">
          {weather.temperature}°C
        </div>
        <div className="mb-4" data-testid="text-condition">
          {weather.condition}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="opacity-80 flex items-center justify-center">
              <Droplets className="h-4 w-4 mr-1" />
              Humidity
            </div>
            <div className="font-semibold" data-testid="text-humidity">
              {weather.humidity}%
            </div>
          </div>
          <div>
            <div className="opacity-80 flex items-center justify-center">
              <Wind className="h-4 w-4 mr-1" />
              Wind
            </div>
            <div className="font-semibold" data-testid="text-wind">
              {weather.windSpeed} km/h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
