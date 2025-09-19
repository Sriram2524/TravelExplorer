import { useQuery } from "@tanstack/react-query";
import { Cloud, Sun, CloudRain } from "lucide-react";
import { fetchWeather } from "@/lib/weather";
import { WeatherData } from "@/types/destination";

interface MiniWeatherProps {
  latitude: number;
  longitude: number;
  destinationId: string;
}

export default function MiniWeather({ latitude, longitude, destinationId }: MiniWeatherProps) {
  const { data: weather, isLoading } = useQuery<WeatherData>({
    queryKey: ["weather", latitude, longitude],
    queryFn: () => fetchWeather(latitude, longitude),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 1, // Only retry once to avoid too many API calls
  });

  if (isLoading) {
    return (
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="w-8 h-3 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null; // Don't show anything if weather fails to load
  }

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) {
      return <CloudRain className="h-4 w-4 text-blue-600" />;
    } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
      return <Cloud className="h-4 w-4 text-gray-600" />;
    } else {
      return <Sun className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div 
      className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-md text-gray-800 text-sm font-medium"
      data-testid={`mini-weather-${destinationId}`}
    >
      <div className="flex items-center space-x-2">
        {getWeatherIcon(weather.condition)}
        <span data-testid={`mini-weather-temp-${destinationId}`}>
          {weather.temperature}°C
        </span>
      </div>
    </div>
  );
}