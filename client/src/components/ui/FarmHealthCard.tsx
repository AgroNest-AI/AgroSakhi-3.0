import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { SensorReading } from "@shared/schema";
import { 
  formatSensorValue, 
  getSensorStatus, 
  getSensorColorClass, 
  getSensorBgColorClass 
} from "@/lib/sensorData";

interface SensorData {
  type: string;
  icon: string;
  label: string;
  value: number;
  unit: string;
  percentage: number;
  status: "good" | "warning" | "danger";
}

interface FarmHealthCardProps {
  sensorReadings: { [key: string]: SensorReading[] };
  isLoading?: boolean;
  onViewAllClick?: () => void;
}

export default function FarmHealthCard({ 
  sensorReadings, 
  isLoading = false,
  onViewAllClick
}: FarmHealthCardProps) {
  const { t } = useTranslation();

  // Process the latest readings from each sensor type
  const processSensorData = (): SensorData[] => {
    const sensorTypes = Object.keys(sensorReadings);
    
    return sensorTypes.map(type => {
      if (!sensorReadings[type] || sensorReadings[type].length === 0) {
        return {
          type,
          icon: getSensorIcon(type),
          label: t(getTypeLabel(type)),
          value: 0,
          unit: getTypeUnit(type),
          percentage: 0,
          status: "good"
        };
      }

      // Get the latest reading
      const latestReading = sensorReadings[type][0];
      const status = getSensorStatus(type, latestReading.value);
      
      // Calculate percentage for progress bar (normalized to 0-100%)
      const percentage = calculatePercentage(type, latestReading.value);

      return {
        type,
        icon: getSensorIcon(type),
        label: t(getTypeLabel(type)),
        value: latestReading.value,
        unit: latestReading.unit,
        percentage,
        status
      };
    });
  };

  // Map sensor types to icons
  const getSensorIcon = (type: string): string => {
    switch (type) {
      case 'soil_moisture':
        return 'water_drop';
      case 'soil_temperature':
        return 'device_thermostat';
      case 'light_level':
        return 'wb_sunny';
      case 'soil_ph':
        return 'ph';
      default:
        return 'sensors';
    }
  };

  // Map sensor types to label translation keys
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'soil_moisture':
        return 'soil_moisture';
      case 'soil_temperature':
        return 'soil_temperature';
      case 'light_level':
        return 'light_level';
      case 'soil_ph':
        return 'soil_ph';
      default:
        return type;
    }
  };

  // Map sensor types to units
  const getTypeUnit = (type: string): string => {
    switch (type) {
      case 'soil_moisture':
        return '%';
      case 'soil_temperature':
        return '°C';
      case 'light_level':
        return '%';
      case 'soil_ph':
        return 'pH';
      default:
        return '';
    }
  };

  // Calculate percentage for progress bar based on sensor type and value
  const calculatePercentage = (type: string, value: number): number => {
    switch (type) {
      case 'soil_moisture':
        // Normalize 0-100%
        return Math.min(100, Math.max(0, value));
      case 'soil_temperature':
        // Normalize 0-50°C to 0-100%
        return Math.min(100, Math.max(0, (value / 50) * 100));
      case 'light_level':
        // Already in percentage
        return Math.min(100, Math.max(0, value));
      case 'soil_ph':
        // Normalize pH 0-14 to 0-100%
        return Math.min(100, Math.max(0, (value / 14) * 100));
      default:
        return 50;
    }
  };

  // If loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-neutral-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-5 bg-neutral-200 rounded w-1/4 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                <div className="animate-pulse space-y-2">
                  <div className="h-5 bg-neutral-200 rounded w-1/2"></div>
                  <div className="h-2 bg-neutral-200 rounded-full"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process the sensor data
  const sensors = processSensorData();
  
  return (
    <Card className="bg-white rounded-lg shadow-md mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{t('farm_health')}</h2>
          {onViewAllClick && (
            <button 
              className="text-accent-500 text-sm font-medium flex items-center"
              onClick={onViewAllClick}
            >
              {t('view_all')}
              <span className="material-icons text-sm ml-1">arrow_forward</span>
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {sensors.map((sensor) => (
            <div 
              key={sensor.type} 
              className="bg-neutral-50 rounded-lg p-3 border border-neutral-200"
            >
              <div className="flex items-center mb-2">
                <span className={`material-icons ${getSensorColorClass(sensor.status)} mr-2`}>
                  {sensor.icon}
                </span>
                <h3 className="text-sm font-medium">{sensor.label}</h3>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div 
                  className={`h-2 ${getSensorBgColorClass(sensor.status)} rounded-full`} 
                  style={{ width: `${sensor.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-neutral-600">
                  {formatSensorValue(sensor.type, sensor.value)}
                </p>
                <p className={`text-xs font-medium ${getSensorColorClass(sensor.status)}`}>
                  {t(`status_${sensor.status}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
