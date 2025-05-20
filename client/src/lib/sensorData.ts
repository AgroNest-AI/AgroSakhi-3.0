import { SensorReading } from "@shared/schema";
import { apiRequest } from "./queryClient";

// Helper function to get sensor data from API
export async function fetchSensorData(
  deviceId: number,
  sensorType: string,
  limit?: number
): Promise<SensorReading[]> {
  try {
    const url = `/api/sensors/${deviceId}/${sensorType}${limit ? `?limit=${limit}` : ''}`;
    const response = await apiRequest("GET", url);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${sensorType} data:`, error);
    return [];
  }
}

// Submit new sensor reading
export async function submitSensorReading(reading: {
  deviceId: number;
  type: string;
  value: number;
  unit: string;
}): Promise<SensorReading> {
  const response = await apiRequest("POST", "/api/sensors", reading);
  return await response.json();
}

// Calculate sensor summary statistics
export function calculateSensorStats(readings: SensorReading[]) {
  if (!readings || readings.length === 0) {
    return { min: 0, max: 0, avg: 0 };
  }

  const values = readings.map(r => r.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

  return {
    min: parseFloat(min.toFixed(1)),
    max: parseFloat(max.toFixed(1)),
    avg: parseFloat(avg.toFixed(1))
  };
}

// Get status based on sensor value and thresholds
export function getSensorStatus(type: string, value: number): "good" | "warning" | "danger" {
  // Define thresholds for different sensor types
  const thresholds: Record<string, { warning: [number, number]; danger: [number, number] }> = {
    soil_moisture: {
      warning: [30, 80], // Below 30% or above 80% is a warning
      danger: [20, 90], // Below 20% or above 90% is danger
    },
    soil_temperature: {
      warning: [15, 28], // Below 15°C or above 28°C is a warning
      danger: [10, 32], // Below 10°C or above 32°C is danger
    },
    light_level: {
      warning: [20, 90], // Below 20% or above 90% is a warning
      danger: [10, 95], // Below 10% or above 95% is danger
    },
    soil_ph: {
      warning: [5.5, 7.5], // Below 5.5 or above 7.5 is a warning
      danger: [5, 8], // Below 5 or above 8 is danger
    },
  };

  // Default to "good" if type is not recognized
  if (!thresholds[type]) {
    return "good";
  }

  const { warning, danger } = thresholds[type];

  if (value < danger[0] || value > danger[1]) {
    return "danger";
  }

  if (value < warning[0] || value > warning[1]) {
    return "warning";
  }

  return "good";
}

// Format sensor value with units
export function formatSensorValue(type: string, value: number): string {
  const units: Record<string, string> = {
    soil_moisture: "%",
    soil_temperature: "°C",
    light_level: "%",
    soil_ph: "pH",
  };

  const unit = units[type] || "";
  return `${value}${unit}`;
}

// Get color class based on sensor status
export function getSensorColorClass(status: "good" | "warning" | "danger"): string {
  switch (status) {
    case "good":
      return "text-success";
    case "warning":
      return "text-warning";
    case "danger":
      return "text-error";
    default:
      return "text-neutral-600";
  }
}

// Get background color class based on sensor status for charts
export function getSensorBgColorClass(status: "good" | "warning" | "danger", intensity = 500): string {
  switch (status) {
    case "good":
      return `bg-primary-${intensity}`;
    case "warning":
      return `bg-warning`;
    case "danger":
      return `bg-error`;
    default:
      return `bg-neutral-${intensity}`;
  }
}
