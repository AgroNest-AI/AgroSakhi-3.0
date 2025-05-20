import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  // Translate content dynamically  
  const { t } = useTranslation();

  const userId = 1; // Will be replaced with context or auth later
  const userLocation = "Barabanki, UP"; // Will be replaced with user's actual location
  const location = userLocation.split(",")[0].trim();

  // Get current hour to determine greeting
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    let greetingText;
    
    if (hour < 12) {
      greetingText = 'Good morning';
    } else if (hour < 18) {
      greetingText = 'Good afternoon';
    } else {
      greetingText = 'Good evening';
    }
    
    setGreeting(greetingText);
  }, []); // Empty dependency array so it only runs once

  // Fetch weather data
  const { 
    data: weather = [], 
    isLoading: isWeatherLoading 
  } = useQuery({
    queryKey: ['/api/weather', location],
    queryFn: () => fetch(`/api/weather/${location}`).then(res => res.json()),
  });

  // Fetch devices
  const { 
    data: devices = [], 
    isLoading: isDevicesLoading 
  } = useQuery({
    queryKey: ['/api/devices', userId],
    queryFn: () => fetch(`/api/devices/${userId}`).then(res => res.json()),
  });

  // Fetch tasks
  const { 
    data: tasks = [], 
    isLoading: isTasksLoading 
  } = useQuery({
    queryKey: ['/api/tasks', userId],
    queryFn: () => fetch(`/api/tasks/${userId}`).then(res => res.json()),
  });

  // Fetch crop recommendations
  const { 
    data: recommendations = [], 
    isLoading: isRecommendationsLoading 
  } = useQuery({
    queryKey: ['/api/recommendations', userId],
    queryFn: () => fetch(`/api/recommendations/${userId}`).then(res => res.json()),
  });

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">{t(greeting)}, Raj!</h1>
        <p className="text-muted-foreground">{t('Here\'s the latest from your farm')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Weather')}</CardTitle>
            <CardDescription>{location}</CardDescription>
          </CardHeader>
          <CardContent>
            {isWeatherLoading ? (
              <p>{t('Loading weather data...')}</p>
            ) : weather && weather.length > 0 ? (
              <div>
                <p className="text-4xl font-bold">{weather[0].temperature}°C</p>
                <p>{weather[0].condition}</p>
                <p>{t('Humidity')}: {weather[0].humidity}%</p>
              </div>
            ) : (
              <p>{t('No weather data available')}</p>
            )}
          </CardContent>
        </Card>

        {/* Farm Sensors Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Farm Sensors')}</CardTitle>
            <CardDescription>{t('Latest readings')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isDevicesLoading ? (
              <p>{t('Loading sensor data...')}</p>
            ) : devices && devices.length > 0 ? (
              <div>
                <p>{t('Device')}: {devices[0].name}</p>
                <p>{t('Status')}: {devices[0].status}</p>
                <p>{t('Battery')}: {devices[0].batteryLevel}%</p>
              </div>
            ) : (
              <p>{t('No sensor data available')}</p>
            )}
          </CardContent>
        </Card>

        {/* Tasks Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Tasks')}</CardTitle>
            <CardDescription>{t('Today\'s tasks')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isTasksLoading ? (
              <p>{t('Loading tasks...')}</p>
            ) : tasks && tasks.length > 0 ? (
              <ul className="space-y-2">
                {tasks.slice(0, 3).map((task, index) => (
                  <li key={index} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={!!task.completed} 
                      className="mr-2"
                      readOnly
                    />
                    <span>{task.title}</span>
                  </li>
                ))}
                {tasks.length > 3 && (
                  <Button variant="link" className="p-0">{t('View all')} ({tasks.length})</Button>
                )}
              </ul>
            ) : (
              <p>{t('No tasks for today')}</p>
            )}
          </CardContent>
        </Card>

        {/* Crop Recommendations Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Crop Recommendations')}</CardTitle>
            <CardDescription>{t('Based on your location and soil')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isRecommendationsLoading ? (
              <p>{t('Loading recommendations...')}</p>
            ) : recommendations && recommendations.length > 0 ? (
              <ul className="space-y-2">
                {recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index}>
                    <p className="font-medium">{rec.cropName} {rec.variety && `(${rec.variety})`}</p>
                    <p className="text-sm text-muted-foreground">{rec.matchPercentage}% {t('match')}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t('No recommendations available')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}