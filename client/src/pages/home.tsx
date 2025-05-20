import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import WeatherCard from '@/components/cards/WeatherCard';
import SensorCard from '@/components/cards/SensorCard';
import TaskCard from '@/components/cards/TaskCard';
import CropRecommendationCard from '@/components/cards/CropRecommendationCard';
import { getRandomSensorValue } from '@/lib/sensorData';

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
    data: weather, 
    isLoading: isWeatherLoading 
  } = useQuery({
    queryKey: ['/api/weather', location],
    queryFn: () => fetch(`/api/weather/${location}`).then(res => res.json()),
  });

  // Fetch devices
  const { 
    data: devices, 
    isLoading: isDevicesLoading 
  } = useQuery({
    queryKey: ['/api/devices', userId],
    queryFn: () => fetch(`/api/devices/${userId}`).then(res => res.json()),
  });

  // Fetch sensor data
  const deviceId = devices && devices.length > 0 ? devices[0].id : null;
  
  const { 
    data: soilMoisture, 
    isLoading: isSoilMoistureLoading 
  } = useQuery({
    queryKey: ['/api/sensors', deviceId, 'soil_moisture'],
    queryFn: () => deviceId ? fetch(`/api/sensors/${deviceId}/soil_moisture`).then(res => res.json()) : [],
    enabled: !!deviceId,
  });

  const { 
    data: soilTemperature, 
    isLoading: isSoilTemperatureLoading 
  } = useQuery({
    queryKey: ['/api/sensors', deviceId, 'soil_temperature'],
    queryFn: () => deviceId ? fetch(`/api/sensors/${deviceId}/soil_temperature`).then(res => res.json()) : [],
    enabled: !!deviceId,
  });

  const { 
    data: lightLevel, 
    isLoading: isLightLevelLoading 
  } = useQuery({
    queryKey: ['/api/sensors', deviceId, 'light_level'],
    queryFn: () => deviceId ? fetch(`/api/sensors/${deviceId}/light_level`).then(res => res.json()) : [],
    enabled: !!deviceId,
  });

  const { 
    data: soilPh, 
    isLoading: isSoilPhLoading 
  } = useQuery({
    queryKey: ['/api/sensors', deviceId, 'soil_ph'],
    queryFn: () => deviceId ? fetch(`/api/sensors/${deviceId}/soil_ph`).then(res => res.json()) : [],
    enabled: !!deviceId,
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
    data: cropRecommendations = [], 
    isLoading: isRecommendationsLoading 
  } = useQuery({
    queryKey: ['/api/recommendations', userId],
    queryFn: () => fetch(`/api/recommendations/${userId}`).then(res => res.json()),
  });

  const isSensorsLoading = isSoilMoistureLoading || isSoilTemperatureLoading || isLightLevelLoading || isSoilPhLoading;

  // Process sensor data
  const sensorData = {
    soil_moisture: {
      data: soilMoisture || [],
      current: soilMoisture && soilMoisture.length > 0 ? soilMoisture[0].value : getRandomSensorValue(30, 60),
      unit: "%",
      status: "normal", // Could be calculated based on thresholds
      label: t("Soil Moisture")
    },
    soil_temperature: {
      data: soilTemperature || [],
      current: soilTemperature && soilTemperature.length > 0 ? soilTemperature[0].value : getRandomSensorValue(20, 30),
      unit: "°C",
      status: "normal",
      label: t("Soil Temperature")
    },
    light_level: {
      data: lightLevel || [],
      current: lightLevel && lightLevel.length > 0 ? lightLevel[0].value : getRandomSensorValue(700, 1000),
      unit: "lux",
      status: "high",
      label: t("Light Level")
    },
    soil_ph: {
      data: soilPh || [],
      current: soilPh && soilPh.length > 0 ? soilPh[0].value : getRandomSensorValue(6, 7.5),
      unit: "pH",
      status: "normal",
      label: t("Soil pH")
    }
  };

  // Get today's tasks
  const getTodaysTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.scheduledDate) return false;
      return new Date(task.scheduledDate).toISOString().split('T')[0] === today;
    });
  };

  // Handlers
  const handleViewAllTasks = () => {
    // Navigate to tasks page
    console.log("View all tasks");
  };

  const handleAddTask = () => {
    console.log("Add task");
  };

  const handleViewAllSensors = () => {
    console.log("View all sensors");
  };

  const handleViewAllRecommendations = () => {
    console.log("View all recommendations");
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">{t(greeting)}, Raj!</h1>
        <p className="text-muted-foreground">{t('Here\'s the latest from your farm')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Weather card */}
        <WeatherCard 
          weatherData={weather && weather.length > 0 ? weather[0] : null} 
          isLoading={isWeatherLoading}
        />

        {/* Sensor info card */}
        <SensorCard 
          sensorData={sensorData} 
          isLoading={isSensorsLoading}
          onViewAllClick={handleViewAllSensors}
        />

        {/* Tasks card */}
        <TaskCard 
          tasks={getTodaysTasks()} 
          isLoading={isTasksLoading}
          onAddTaskClick={handleAddTask}
          userId={userId}
        />

        {/* Crop Recommendations card */}
        <CropRecommendationCard 
          recommendations={Array.isArray(cropRecommendations) ? cropRecommendations : []} 
          isLoading={isRecommendationsLoading}
          onViewAllClick={handleViewAllRecommendations}
        />
      </div>
    </div>
  );
}