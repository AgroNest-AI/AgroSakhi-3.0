import { WeatherForecast } from "@shared/schema";
import { apiRequest } from "./queryClient";

// Weather condition icons mapping
export const weatherIcons: Record<string, string> = {
  sunny: "wb_sunny",
  partly_cloudy: "partly_cloudy_day",
  cloudy: "cloud",
  rainy: "grain",
  stormy: "thunderstorm",
  snowy: "ac_unit",
  foggy: "cloud",
  windy: "air",
};

// Helper function to get weather data from API
export async function fetchWeatherData(
  location: string,
  days = 7
): Promise<WeatherForecast[]> {
  try {
    const url = `/api/weather/${location}?days=${days}`;
    const response = await apiRequest("GET", url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return [];
  }
}

// Format date for display
export function formatWeatherDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
}

// Format short day name (Mon, Tue, etc.)
export function formatDayShort(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

// Get icon for weather condition
export function getWeatherIcon(condition: string): string {
  return weatherIcons[condition] || "help_outline";
}

// Get color class for weather condition
export function getWeatherColorClass(condition: string): string {
  const colorMap: Record<string, string> = {
    sunny: "text-secondary-500",
    partly_cloudy: "text-secondary-400",
    cloudy: "text-accent-500",
    rainy: "text-accent-700",
    stormy: "text-accent-900",
    snowy: "text-accent-300",
    foggy: "text-neutral-400",
    windy: "text-accent-400",
  };
  
  return colorMap[condition] || "text-neutral-500";
}

// Format temperature with degree symbol
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°`;
}

// Get the current weather forecast
export function getCurrentWeather(forecasts: WeatherForecast[]): WeatherForecast | null {
  if (!forecasts || forecasts.length === 0) {
    return null;
  }
  
  // Find forecast for current day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayForecast = forecasts.find(forecast => {
    const forecastDate = new Date(forecast.forecastDate);
    forecastDate.setHours(0, 0, 0, 0);
    return forecastDate.getTime() === today.getTime();
  });
  
  return todayForecast || forecasts[0];
}

// Get background class based on weather condition
export function getWeatherBgClass(condition: string): string {
  const bgMap: Record<string, string> = {
    sunny: "from-primary-900 to-primary-700",
    partly_cloudy: "from-primary-800 to-accent-700",
    cloudy: "from-accent-900 to-accent-700",
    rainy: "from-accent-900 to-accent-800",
    stormy: "from-neutral-900 to-accent-900",
    snowy: "from-accent-800 to-neutral-700",
    foggy: "from-neutral-800 to-neutral-600",
    windy: "from-accent-800 to-primary-800",
  };
  
  return `bg-gradient-to-r ${bgMap[condition] || "from-primary-900 to-primary-700"}`;
}
