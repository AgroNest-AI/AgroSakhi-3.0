import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { SensorReading } from "@shared/schema";
import { 
  calculateSensorStats, 
  getSensorStatus, 
  getSensorBgColorClass 
} from "@/lib/sensorData";

type TimeRange = "day" | "week" | "month";

interface SensorChartProps {
  deviceId: number;
  sensorType: string;
  location: string;
  data: SensorReading[];
  isLoading?: boolean;
}

export default function SensorChart({
  deviceId,
  sensorType,
  location,
  data,
  isLoading = false,
}: SensorChartProps) {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [chartData, setChartData] = useState<SensorReading[]>([]);

  // Process data based on time range
  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      return;
    }

    // Sort data by timestamp (newest first)
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.timestamp || 0);
      const dateB = new Date(b.timestamp || 0);
      return dateB.getTime() - dateA.getTime();
    });

    const now = new Date();
    let filteredData: SensorReading[] = [];

    switch (timeRange) {
      case "day":
        // Last 24 hours
        filteredData = sortedData.filter(reading => {
          const readingDate = new Date(reading.timestamp || 0);
          const hoursDiff = (now.getTime() - readingDate.getTime()) / (1000 * 60 * 60);
          return hoursDiff <= 24;
        });
        break;
      case "week":
        // Last 7 days
        filteredData = sortedData.filter(reading => {
          const readingDate = new Date(reading.timestamp || 0);
          const daysDiff = (now.getTime() - readingDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7;
        });
        break;
      case "month":
        // Last 30 days
        filteredData = sortedData.filter(reading => {
          const readingDate = new Date(reading.timestamp || 0);
          const daysDiff = (now.getTime() - readingDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 30;
        });
        break;
    }

    // Limit to 7 data points for visualization
    setChartData(filteredData.slice(0, 7));
  }, [data, timeRange]);

  // Format day label
  const formatDayLabel = (date: Date | string | null): string => {
    if (!date) return "";
    
    const d = new Date(date);
    
    if (timeRange === "day") {
      return d.toLocaleTimeString([], { hour: '2-digit' });
    } else {
      return d.toLocaleDateString([], { weekday: 'short' });
    }
  };

  // Calculate height percentage for chart bars
  const calculateHeight = (value: number, max: number): string => {
    if (max === 0) return "0%";
    const percentage = (value / max) * 100;
    return `${Math.max(5, percentage)}%`;
  };

  // Calculate statistics
  const stats = calculateSensorStats(chartData);

  // Get title based on sensor type
  const getSensorTitle = (): string => {
    switch (sensorType) {
      case "soil_moisture":
        return t('soil_moisture');
      case "soil_temperature":
        return t('soil_temperature');
      case "light_level":
        return t('light_level');
      case "soil_ph":
        return t('soil_ph');
      default:
        return sensorType;
    }
  };

  // Get units based on sensor type
  const getUnitLabel = (): string => {
    switch (sensorType) {
      case "soil_moisture":
        return "%";
      case "soil_temperature":
        return "°C";
      case "light_level":
        return "%";
      case "soil_ph":
        return "pH";
      default:
        return "";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2 animate-pulse">
          <div className="h-5 bg-neutral-200 rounded w-1/3"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
        </div>
        <div className="h-36 bg-neutral-100 rounded animate-pulse"></div>
        <div className="flex justify-between mt-3 animate-pulse">
          <div className="h-4 bg-neutral-200 rounded w-1/5"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/5"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/5"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">{getSensorTitle()}</h3>
        <span className="text-xs text-neutral-600">{location}</span>
      </div>
      <div className="h-36 flex items-end justify-between">
        {chartData.length === 0 ? (
          <div className="w-full flex items-center justify-center h-full bg-neutral-50 rounded">
            <p className="text-neutral-500 text-sm">{t('No data available')}</p>
          </div>
        ) : (
          chartData.map((reading, index) => {
            const status = getSensorStatus(sensorType, reading.value);
            const colorClass = getSensorBgColorClass(status);
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center" 
                style={{ width: `calc(100% / ${Math.max(chartData.length, 1)} - 8px)` }}
              >
                <div 
                  className={`w-full ${colorClass} rounded-t-sm chart-bar`} 
                  style={{ height: calculateHeight(reading.value, stats.max) }}
                ></div>
                <p className="text-xs mt-1 text-neutral-500">
                  {formatDayLabel(reading.timestamp)}
                </p>
              </div>
            );
          })
        )}
      </div>
      <div className="flex justify-between mt-3 text-xs text-neutral-600">
        <span>{t('min')}: {stats.min}{getUnitLabel()}</span>
        <span>{t('average')}: {stats.avg}{getUnitLabel()}</span>
        <span>{t('max')}: {stats.max}{getUnitLabel()}</span>
      </div>
    </div>
  );
}

export function SensorChartControls({ 
  activeRange, 
  onChange 
}: { 
  activeRange: TimeRange, 
  onChange: (range: TimeRange) => void 
}) {
  const { t } = useTranslation();
  
  return (
    <div className="flex bg-neutral-100 rounded-lg p-1 mb-4">
      <button 
        className={`flex-1 py-1.5 text-center text-sm rounded-md ${
          activeRange === 'day' ? 'bg-white shadow' : 'text-neutral-600'
        }`}
        onClick={() => onChange('day')}
      >
        {t('time_range_day')}
      </button>
      <button 
        className={`flex-1 py-1.5 text-center text-sm rounded-md ${
          activeRange === 'week' ? 'bg-white shadow' : 'text-neutral-600'
        }`}
        onClick={() => onChange('week')}
      >
        {t('time_range_week')}
      </button>
      <button 
        className={`flex-1 py-1.5 text-center text-sm rounded-md ${
          activeRange === 'month' ? 'bg-white shadow' : 'text-neutral-600'
        }`}
        onClick={() => onChange('month')}
      >
        {t('time_range_month')}
      </button>
    </div>
  );
}
