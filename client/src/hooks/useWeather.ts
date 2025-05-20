import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { WeatherForecast } from "@shared/schema";

export function useWeather(location: string, days = 7) {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);

  // Fetch weather data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`/api/weather/${encodeURIComponent(location)}?days=${days}`],
    enabled: !!location,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Process weather data
  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        // Get today's weather
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Find forecast for current day
        const todayForecast = data.find(forecast => {
          const forecastDate = new Date(forecast.forecastDate);
          forecastDate.setHours(0, 0, 0, 0);
          return forecastDate.getTime() === today.getTime();
        });
        
        setWeather(todayForecast || null);
        setForecast(data);
      } else {
        // Handle if a single forecast is returned
        setWeather(data);
        setForecast([data]);
      }
    }
  }, [data]);

  // Generate mock weather data when needed for development
  const generateMockWeatherData = (loc: string, dayCount: number) => {
    const today = new Date();
    const forecasts: WeatherForecast[] = [];
    
    const conditions = ["sunny", "partly_cloudy", "cloudy", "rainy"];
    
    for (let i = 0; i < dayCount; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const temperature = Math.round(25 + (Math.random() * 10 - 5)); // 20-30°C
      const minTemperature = Math.round(temperature - (2 + Math.random() * 3)); // 2-5° less
      const maxTemperature = Math.round(temperature + (2 + Math.random() * 3)); // 2-5° more
      const humidity = Math.round(50 + Math.random() * 40); // 50-90%
      const rainfall = condition === "rainy" ? Math.round(Math.random() * 20) : 0;
      
      forecasts.push({
        id: i + 1,
        location: loc,
        forecastDate,
        temperature,
        minTemperature,
        maxTemperature,
        humidity,
        rainfall,
        condition
      });
    }
    
    return forecasts;
  };

  // If no data but we need something for UI development
  useEffect(() => {
    if (!isLoading && !data && !isError) {
      const mockForecasts = generateMockWeatherData(location, days);
      setWeather(mockForecasts[0]);
      setForecast(mockForecasts);
    }
  }, [isLoading, data, isError, location, days]);

  return {
    weather,
    forecast,
    isLoading,
    isError,
    error
  };
}
