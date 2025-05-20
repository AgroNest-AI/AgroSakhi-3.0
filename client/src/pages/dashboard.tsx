import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import FarmSummary from "@/components/ui/FarmSummary";
import CropStatus from "@/components/ui/CropStatus";
import WeatherForecastCard from "@/components/ui/WeatherForecast";
import VoiceAssistant from "@/components/ui/VoiceAssistant";
import AICropRecommender from "@/components/ui/AICropRecommender";
import { Button } from "@/components/ui/button";
import { Farm, Crop } from "@shared/schema";
import { useWeather } from "@/hooks/useWeather";

// Sample rainfall data
const sampleRainfallData = [
  { date: "2023-02-20", value: 0.5 },
  { date: "2023-02-21", value: 0 },
  { date: "2023-02-22", value: 0 },
  { date: "2023-02-23", value: 15 },
  { date: "2023-02-24", value: 5 },
  { date: "2023-02-25", value: 0.5 },
  { date: "2023-02-26", value: 0 },
  { date: "2023-02-27", value: 0 },
  { date: "2023-02-28", value: 0 },
  { date: "2023-03-01", value: 3 }
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useUser();
  const userId = user?.id || 1;
  const userLocation = user?.location?.split(",")[0] || "Barabanki";

  // Fetch farm data
  const { data: farms, isLoading: isFarmsLoading } = useQuery({
    queryKey: [`/api/farms/${userId}`],
  });

  // Fetch crops data
  const { data: crops, isLoading: isCropsLoading } = useQuery({
    queryKey: [`/api/crops/${userId}`],
  });

  // Fetch weather forecast for 10 days
  const { forecast, isLoading: isWeatherLoading } = useWeather(userLocation, 10);

  // Get the primary farm
  const getPrimaryFarm = (): Farm | null => {
    if (!farms || farms.length === 0) return null;
    return farms[0];
  };

  // Handler for adding a new crop
  const handleAddCrop = () => {
    // In a real app, this would open a modal or form
    console.log("Add crop clicked");
  };

  // Handler for crop click
  const handleCropClick = (crop: Crop) => {
    // In a real app, this might navigate to a crop detail view
    console.log("Crop clicked:", crop.id);
  };

  // Calculate farm stats
  const getFarmStats = () => {
    return {
      totalCrops: crops?.length || 0,
      activeDevices: 5, // Mocked for demo
      projectedHarvest: 1250, // Mocked for demo
      estimatedRevenue: 28000 // Mocked for demo
    };
  };

  // State for toggling AI recommender visibility
  const [showAIRecommender, setShowAIRecommender] = useState(false);

  return (
    <div className="p-4 pb-16">
      <h1 className="text-2xl font-display font-bold mb-4">{t('farm_dashboard')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Farm Summary */}
          <FarmSummary
            farm={getPrimaryFarm()}
            stats={getFarmStats()}
            isLoading={isFarmsLoading}
          />
          
          {/* Crop Status */}
          <CropStatus
            crops={crops || []}
            isLoading={isCropsLoading}
            onAddCropClick={handleAddCrop}
            onCropClick={handleCropClick}
          />
          
          {/* Weather Forecast */}
          <WeatherForecastCard
            forecasts={forecast}
            rainfallData={sampleRainfallData}
            isLoading={isWeatherLoading}
          />
        </div>
        
        <div className="space-y-4">
          {/* Voice Assistant */}
          <VoiceAssistant />
          
          {/* AI Crop Recommender Toggle Button */}
          <div className="flex justify-center my-4">
            <Button 
              onClick={() => setShowAIRecommender(!showAIRecommender)}
              variant="outline"
              className="flex items-center"
            >
              {showAIRecommender ? (
                <>{t('Hide AI Crop Recommender')}</>
              ) : (
                <>{t('Show AI Crop Recommender')}</>
              )}
            </Button>
          </div>
          
          {/* AI Crop Recommender (Expandable) */}
          {showAIRecommender && (
            <AICropRecommender />
          )}
        </div>
      </div>
    </div>
  );
}
