import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Device } from "@shared/schema";

interface IoTDeviceCardProps {
  devices: Device[];
  isLoading?: boolean;
  onAddDeviceClick?: () => void;
  onDeviceClick?: (device: Device) => void;
}

export default function IoTDeviceCard({
  devices,
  isLoading = false,
  onAddDeviceClick,
  onDeviceClick,
}: IoTDeviceCardProps) {
  const { t } = useTranslation();

  // Device type to image mapping
  const getDeviceImage = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'agrosakhi band':
        return 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120';
      case 'sakhisense station':
        return 'https://pixabay.com/get/gff1fefa8bd2d3e882d8fa9f8c15f8efdfdfb93be0c6df2ba430334b45c4baaec11ef68b50ec19e0acff96d45bfbfb9681eda91247e219caa2773896a44bb1865_1280.jpg';
      case 'pest monitor':
        return 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120';
      default:
        return 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120';
    }
  };

  // Get status color and text
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return { color: 'bg-success', text: t('online') };
      case 'offline':
        return { color: 'bg-error', text: t('offline') };
      case 'low_signal':
        return { color: 'bg-warning', text: t('low_signal') };
      default:
        return { color: 'bg-neutral-400', text: status };
    }
  };

  // Format date to relative time
  const formatLastSeen = (date: Date | string | null): string => {
    if (!date) return "";
    
    const lastSeen = new Date(date);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 24 * 60) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffMinutes / (60 * 24))}d ago`;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="h-6 bg-neutral-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-5 bg-neutral-200 rounded w-1/4 animate-pulse"></div>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg animate-pulse">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-neutral-200 rounded-lg mr-3"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-neutral-200 rounded w-24"></div>
                    <div className="h-4 bg-neutral-200 rounded w-20"></div>
                    <div className="h-4 bg-neutral-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-md mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">{t('your_devices')}</h2>
          {onAddDeviceClick && (
            <button
              className="text-accent-500 text-sm font-medium flex items-center"
              onClick={onAddDeviceClick}
            >
              <span className="material-icons text-sm mr-1">add</span>
              {t('add_device')}
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {devices.length === 0 ? (
            <p className="text-neutral-600 text-sm">
              {t('No devices registered')}
            </p>
          ) : (
            devices.map((device) => {
              const statusInfo = getStatusInfo(device.status || 'offline');
              
              return (
                <div 
                  key={device.id} 
                  className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50"
                  onClick={() => onDeviceClick && onDeviceClick(device)}
                >
                  <div className="flex items-center">
                    <img 
                      src={getDeviceImage(device.type)} 
                      alt={device.name} 
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                    <div>
                      <h3 className="font-medium">{device.name}</h3>
                      <p className="text-xs text-neutral-600">{device.location}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-block w-2 h-2 ${statusInfo.color} rounded-full mr-1`}></span>
                        <span className={`text-xs ${statusInfo.color.replace('bg-', 'text-')}`}>
                          {statusInfo.text}
                        </span>
                        <span className="mx-1 text-neutral-300">|</span>
                        <span className="text-xs text-neutral-600">
                          {t('battery')}: {device.batteryLevel}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="material-icons text-neutral-400">chevron_right</span>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
