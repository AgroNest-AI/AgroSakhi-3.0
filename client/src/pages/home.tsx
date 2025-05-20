import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { useVoice } from "@/context/VoiceContext";
import WeatherCard from "@/components/ui/WeatherCard";
import FarmHealthCard from "@/components/ui/FarmHealthCard";
import TaskCard from "@/components/ui/TaskCard";
import CropRecommendationCard from "@/components/ui/CropRecommendationCard";
import { useTasks } from "@/hooks/useTasks";
import { useWeather } from "@/hooks/useWeather";
import { useSensors } from "@/hooks/useSensors";

export default function Home() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { toggleVoiceAssistant } = useVoice();
  const userId = user?.id || 1;
  const userLocation = user?.location || "Barabanki, Uttar Pradesh";
  const location = userLocation.split(",")[0].trim();

  // Get current hour to determine greeting
  const [greeting, setGreeting] = useState(t('greeting'));
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(t('Good morning'));
    } else if (hour < 18) {
      setGreeting(t('Good afternoon'));
    } else {
      setGreeting(t('Good evening'));
    }
  }, []); // Empty dependency array so it only runs once

  // Fetch weather data
  const { 
    weather: currentWeather, 
    forecast, 
    isLoading: isWeatherLoading 
  } = useWeather(location);

  // Fetch sensor data
  const { 
    sensorReadings, 
    isLoading: isSensorsLoading 
  } = useSensors(userId);

  // Fetch tasks
  const { 
    getTodaysTasks, 
    tasks, 
    isLoading: isTasksLoading,
    createTask,
    toggleTaskCompletion
  } = useTasks(userId);

  // Fetch crop recommendations
  const { data: cropRecommendations, isLoading: isRecommendationsLoading } = useQuery({
    queryKey: [`/api/recommendations/${userId}`],
    enabled: !!userId,
  });

  // Handler for adding a new task
  const handleAddTask = () => {
    // In a real app, this would open a modal or form
    console.log("Add task clicked");
  };

  // Handler for viewing all sensor data
  const handleViewAllSensors = () => {
    // Navigate to IoT devices page
    window.location.href = "/iot";
  };

  // Handler for viewing all crop recommendations
  const handleViewAllRecommendations = () => {
    // In a real app, this would navigate to a recommendations page
    console.log("View all recommendations clicked");
  };

  return (
    <div>
      {/* Hero header with gradient background */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-primary-900 to-primary-700 relative overflow-hidden">
          <img 
            src="https://pixabay.com/get/gfa8a0cb9e1689f6a4343070d301bccb2a9ebb8ebe74fde95b8c53f9f516d8d3cfb0c52956b9548407b7dc3b517168f4d514cc938e4828982232050a1cbba3cb8_1280.jpg" 
            alt="Rural farming in India" 
            className="object-cover w-full h-full mix-blend-overlay opacity-60"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
            <p className="text-sm font-medium">{greeting}</p>
            <h1 className="text-2xl font-display font-bold">{user?.displayName || "Farmer"}</h1>
            <div className="flex items-center mt-1">
              <span className="material-icons text-sm mr-1">place</span>
              <p className="text-sm">{userLocation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="p-4">
        {/* Weather card */}
        <WeatherCard 
          currentWeather={currentWeather} 
          forecast={forecast} 
          isLoading={isWeatherLoading} 
        />

        {/* Farm Health card */}
        <FarmHealthCard 
          sensorReadings={sensorReadings} 
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
          recommendations={cropRecommendations || []} 
          isLoading={isRecommendationsLoading}
          onViewAllClick={handleViewAllRecommendations}
        />
      </div>
    </div>
  );
}
