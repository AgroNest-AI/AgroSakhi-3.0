import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import IoTDeviceCard from "@/components/ui/IoTDeviceCard";
import { SensorChartControls, default as SensorChart } from "@/components/ui/SensorChart";
import AlertSettings from "@/components/ui/AlertSettings";
import { useSensors } from "@/hooks/useSensors";
import { Device, SensorReading } from "@shared/schema";

type TimeRange = "day" | "week" | "month";

export default function IoTDevices() {
  const { t } = useTranslation();
  const { user } = useUser();
  const userId = user?.id || 1;
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Fetch devices
  const { data: devices, isLoading: isDevicesLoading } = useQuery({
    queryKey: [`/api/devices/${userId}`],
    enabled: !!userId,
  });

  // Fetch sensor readings for all devices
  const { 
    sensorReadings, 
    isLoading: isSensorsLoading 
  } = useSensors(userId);

  // Handler for adding a new device
  const handleAddDevice = () => {
    // In a real app, this would open a modal or form
    console.log("Add device clicked");
  };

  // Handler for selecting a device
  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
  };

  // Handler for changing time range of sensor charts
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  // Handler for customizing alerts
  const handleCustomizeAlerts = () => {
    // In a real app, this would open a modal or form
    console.log("Customize alerts clicked");
  };

  // Handler for viewing all sensor data
  const handleViewAllSensorData = () => {
    // In a real app, this might navigate to a detailed sensor data page
    console.log("View all sensor data clicked");
  };

  return (
    <div className="p-4 pb-16">
      <h1 className="text-2xl font-display font-bold mb-4">{t('devices_title')}</h1>
      
      {/* IoT Devices card */}
      <IoTDeviceCard
        devices={devices || []}
        isLoading={isDevicesLoading}
        onAddDeviceClick={handleAddDevice}
        onDeviceClick={handleDeviceClick}
      />
      
      {/* Sensor Readings */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">{t('sensor_readings')}</h2>
        
        {/* Time Range Selector */}
        <SensorChartControls activeRange={timeRange} onChange={handleTimeRangeChange} />
        
        {/* Soil Moisture Chart */}
        <SensorChart
          deviceId={selectedDevice?.id || 1}
          sensorType="soil_moisture"
          location={selectedDevice?.location || "North Wheat Field"}
          data={(sensorReadings['soil_moisture'] || []) as SensorReading[]}
          isLoading={isSensorsLoading}
        />
        
        {/* Soil Temperature Chart */}
        <SensorChart
          deviceId={selectedDevice?.id || 1}
          sensorType="soil_temperature"
          location={selectedDevice?.location || "North Wheat Field"}
          data={(sensorReadings['soil_temperature'] || []) as SensorReading[]}
          isLoading={isSensorsLoading}
        />
        
        <button
          className="w-full mt-4 py-2 bg-primary-500 text-white rounded-lg flex items-center justify-center"
          onClick={handleViewAllSensorData}
        >
          {t('view_all_sensor_data')}
        </button>
      </div>
      
      {/* Alert Settings */}
      <AlertSettings
        onCustomizeClick={handleCustomizeAlerts}
        isLoading={false}
      />
    </div>
  );
}
