import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherForecast } from "@shared/schema";
import { 
  formatTemperature, 
  getWeatherIcon, 
  getWeatherColorClass,
  formatWeatherDate
} from "@/lib/weatherData";

interface WeatherForecastProps {
  forecasts: WeatherForecast[];
  rainfallData?: { date: string; value: number }[];
  isLoading?: boolean;
}

export default function WeatherForecastCard({
  forecasts,
  rainfallData,
  isLoading = false,
}: WeatherForecastProps) {
  const { t } = useTranslation();

  // Format date for display (day only)
  const formatDay = (date: string | Date) => {
    return new Date(date).getDate().toString();
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="h-6 bg-neutral-200 rounded w-1/2 mb-3 animate-pulse"></div>
          
          <div className="overflow-x-auto -mx-4 px-4 animate-pulse">
            <div className="h-32 bg-neutral-100 rounded w-full"></div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-neutral-200 animate-pulse">
            <div className="h-5 bg-neutral-200 rounded w-1/3 mb-2"></div>
            <div className="h-24 bg-neutral-100 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-md mb-4">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">{t('weather_forecast_extended')}</h2>
        
        {forecasts.length === 0 ? (
          <p className="text-neutral-600 text-sm">{t('No weather forecast data available')}</p>
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex space-x-4 min-w-max pb-2">
                {forecasts.map((day, index) => (
                  <div key={index} className="flex flex-col items-center w-16">
                    <p className="text-sm font-medium">
                      {index === 0 ? t('Today') : new Date(day.forecastDate).toLocaleDateString("en-US", { weekday: 'short' })}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {formatWeatherDate(day.forecastDate).split(' ')[1]}
                    </p>
                    <div className="my-2">
                      <span className={`material-icons text-2xl ${getWeatherColorClass(day.condition || 'sunny')}`}>
                        {getWeatherIcon(day.condition || 'sunny')}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{formatTemperature(day.maxTemperature || 0)}</p>
                    <p className="text-xs text-neutral-500">{formatTemperature(day.minTemperature || 0)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {rainfallData && rainfallData.length > 0 && (
              <div className="mt-4 pt-3 border-t border-neutral-200">
                <h3 className="text-sm font-medium mb-2">{t('rainfall_forecast')}</h3>
                <div className="h-24 flex items-end justify-between">
                  {rainfallData.map((data, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center"
                      style={{ width: `calc(100% / ${rainfallData.length} - 5px)` }}
                    >
                      <div 
                        className={`w-full ${data.value > 0 ? 'bg-accent-' + (300 + Math.min(data.value * 20, 600)) : 'bg-accent-200'} rounded-t-sm chart-bar`} 
                        style={{ height: `${data.value > 0 ? Math.max(5, data.value * 4) : 0}%` }}
                      ></div>
                      <p className="text-xs mt-1 text-neutral-500">{formatDay(data.date)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <div className="text-xs text-neutral-600 flex items-center">
                    <span className="inline-block w-3 h-3 bg-accent-500 mr-1"></span>
                    <span>mm of rain</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
