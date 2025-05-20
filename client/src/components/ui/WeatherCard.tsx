import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { 
  formatTemperature, 
  getWeatherIcon, 
  getWeatherColorClass 
} from "@/lib/weatherData";
import { WeatherForecast } from "@shared/schema";

interface WeatherCardProps {
  currentWeather: WeatherForecast | null;
  forecast: WeatherForecast[];
  isLoading?: boolean;
}

export default function WeatherCard({ currentWeather, forecast, isLoading = false }: WeatherCardProps) {
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-neutral-200 rounded mb-4 w-3/4"></div>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-10 w-10 bg-neutral-200 rounded-full"></div>
                <div className="h-8 bg-neutral-200 rounded w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-neutral-200 rounded w-24"></div>
                <div className="h-5 bg-neutral-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentWeather) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold">{t('weather_title')}</h2>
          <p className="text-neutral-600 mt-2">
            {t('weather data not available')}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get 5-day forecast (excluding today if it's already in forecast data)
  const fiveDayForecast = forecast.slice(0, 5);

  // Get day names for the week (Mon, Tue, etc.)
  const getDayName = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", { weekday: 'short' });
  };

  return (
    <Card className="bg-white rounded-lg shadow-md mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">{t('weather_title')}</h2>
            <div className="flex items-center mt-2">
              <span className={`material-icons text-4xl ${getWeatherColorClass(currentWeather.condition || 'sunny')}`}>
                {getWeatherIcon(currentWeather.condition || 'sunny')}
              </span>
              <div className="ml-3">
                <p className="text-2xl font-bold">{formatTemperature(currentWeather.temperature || 0)}</p>
                <p className="text-sm text-neutral-600">
                  {t(`weather_condition_${currentWeather.condition || 'sunny'}`)}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600">{currentWeather.location}</p>
            <div className="flex items-center justify-end mt-2">
              <span className="material-icons text-sm text-neutral-600 mr-1">water_drop</span>
              <span className="text-sm text-neutral-600">
                {currentWeather.humidity}% {t('weather_humidity')}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 border-t border-neutral-200 pt-3">
          <h3 className="text-sm font-medium text-neutral-700 mb-2">{t('weather_forecast')}</h3>
          <div className="flex justify-between">
            {fiveDayForecast.map((day, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-neutral-600">{getDayName(day.forecastDate)}</p>
                <span className={`material-icons ${getWeatherColorClass(day.condition || 'sunny')}`}>
                  {getWeatherIcon(day.condition || 'sunny')}
                </span>
                <p className="text-xs font-medium">{formatTemperature(day.maxTemperature || 0)}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
