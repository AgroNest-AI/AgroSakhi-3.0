import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface Alert {
  id: string;
  icon: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface AlertSettingsProps {
  onCustomizeClick?: () => void;
  isLoading?: boolean;
}

export default function AlertSettings({
  onCustomizeClick,
  isLoading = false,
}: AlertSettingsProps) {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "low_moisture",
      icon: "warning",
      title: t('low_moisture_alert'),
      description: "Below 40% for 12+ hours",
      enabled: true,
    },
    {
      id: "high_temperature",
      icon: "device_thermostat",
      title: t('high_temperature_alert'),
      description: "Above 30°C for 6+ hours",
      enabled: true,
    },
    {
      id: "pest_detection",
      icon: "pest_control",
      title: t('pest_detection_alert'),
      description: "When camera detects pest activity",
      enabled: true,
    },
    {
      id: "low_battery",
      icon: "battery_alert",
      title: t('low_battery_alert'),
      description: "Device battery below 20%",
      enabled: true,
    },
  ]);

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
      )
    );
  };

  // Get icon color based on alert type
  const getIconColor = (id: string): string => {
    switch (id) {
      case "low_moisture":
        return "text-error";
      case "high_temperature":
        return "text-error";
      case "pest_detection":
        return "text-warning";
      case "low_battery":
        return "text-accent-500";
      default:
        return "text-neutral-500";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="h-6 bg-neutral-200 rounded w-1/3 mb-3 animate-pulse"></div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full mr-2"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-neutral-200 rounded w-32"></div>
                    <div className="h-4 bg-neutral-200 rounded w-40"></div>
                  </div>
                </div>
                <div className="w-12 h-6 bg-neutral-200 rounded-full"></div>
              </div>
            ))}
          </div>
          
          <div className="h-10 bg-neutral-200 rounded-lg w-full mt-4 animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-md mb-4">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">{t('alert_settings')}</h2>
        
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className={`material-icons ${getIconColor(alert.id)} mr-2`}>
                  {alert.icon}
                </span>
                <div>
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-xs text-neutral-600">{alert.description}</p>
                </div>
              </div>
              <Switch
                checked={alert.enabled}
                onCheckedChange={() => toggleAlert(alert.id)}
                aria-label={`${alert.title} toggle`}
              />
            </div>
          ))}
        </div>
        
        <button
          className="w-full mt-4 py-2 border border-primary-500 text-primary-500 rounded-lg flex items-center justify-center"
          onClick={onCustomizeClick}
        >
          {t('customize_alerts')}
        </button>
      </CardContent>
    </Card>
  );
}
