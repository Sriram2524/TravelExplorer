export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface FilterState {
  region: string | null;
  tag: string | null;
  search: string;
}
