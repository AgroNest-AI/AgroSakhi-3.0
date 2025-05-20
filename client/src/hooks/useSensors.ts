import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SensorReading } from "@shared/schema";

// Get mock sensor data for UI development
const getMockSensorData = (type: string, count = 10): SensorReading[] => {
  const readings: SensorReading[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() - i);
    
    let value = 0;
    let unit = "";
    
    switch (type) {
      case "soil_moisture":
        value = 40 + Math.floor(Math.random() * 30); // 40-70%
        unit = "%";
        break;
      case "soil_temperature":
        value = 22 + Math.floor(Math.random() * 8); // 22-30°C
        unit = "°C";
        break;
      case "light_level":
        value = 50 + Math.floor(Math.random() * 40); // 50-90%
        unit = "%";
        break;
      case "soil_ph":
        value = 6.0 + Math.random() * 1.5; // 6.0-7.5 pH
        unit = "pH";
        break;
      default:
        value = Math.random() * 100;
        unit = "";
    }
    
    readings.push({
      id: i + 1,
      deviceId: 1,
      type,
      value,
      unit,
      timestamp
    });
  }
  
  return readings;
};

export function useSensors(userId: number) {
  const [sensorTypes] = useState<string[]>([
    "soil_moisture",
    "soil_temperature",
    "light_level",
    "soil_ph"
  ]);
  
  const [sensorReadings, setSensorReadings] = useState<{
    [key: string]: SensorReading[];
  }>({});
  
  // Fetch devices for user
  const { data: devices, isLoading: isDevicesLoading } = useQuery({
    queryKey: [`/api/devices/${userId}`],
    enabled: !!userId,
  });
  
  // Fetch sensor readings for each sensor type
  const sensorQueries = sensorTypes.map(type => {
    const deviceId = devices && devices.length > 0 ? devices[0].id : 1;
    
    return useQuery({
      queryKey: [`/api/sensors/${deviceId}/${type}`],
      enabled: !!deviceId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  });
  
  const isLoading = isDevicesLoading || sensorQueries.some(query => query.isLoading);
  const isError = sensorQueries.some(query => query.isError);
  
  // Process sensor data when queries complete
  useEffect(() => {
    const newReadings: { [key: string]: SensorReading[] } = {};
    
    sensorTypes.forEach((type, index) => {
      const query = sensorQueries[index];
      
      if (query.data) {
        newReadings[type] = query.data;
      } else if (!query.isLoading) {
        // Use mock data if no real data is available
        newReadings[type] = getMockSensorData(type);
      }
    });
    
    setSensorReadings(newReadings);
  }, [sensorQueries, sensorTypes]);
  
  // Submit new sensor reading
  const submitSensorReading = async (reading: {
    deviceId: number;
    type: string;
    value: number;
    unit: string;
  }) => {
    try {
      const response = await apiRequest("POST", "/api/sensors", reading);
      const newReading = await response.json();
      
      // Update local state
      setSensorReadings(prev => ({
        ...prev,
        [reading.type]: [newReading, ...(prev[reading.type] || [])]
      }));
      
      return newReading;
    } catch (error) {
      console.error("Error submitting sensor reading:", error);
      throw error;
    }
  };
  
  return {
    sensorReadings,
    isLoading,
    isError,
    submitSensorReading,
    refreshSensorData: () => {
      sensorQueries.forEach(query => query.refetch());
    }
  };
}
