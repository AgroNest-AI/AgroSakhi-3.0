import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Crop } from "@shared/schema";

interface CropStatusProps {
  crops: Crop[];
  isLoading?: boolean;
  onAddCropClick?: () => void;
  onCropClick?: (crop: Crop) => void;
}

export default function CropStatus({
  crops,
  isLoading = false,
  onAddCropClick,
  onCropClick,
}: CropStatusProps) {
  const { t } = useTranslation();

  // Calculate days until harvest
  const getDaysUntilHarvest = (harvestDate: Date | string | null): number => {
    if (!harvestDate) return 0;
    
    const harvest = new Date(harvestDate);
    const today = new Date();
    const diffTime = harvest.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Format planting date
  const formatPlantingDate = (date: Date | string | null): string => {
    if (!date) return "";
    
    const plantDate = new Date(date);
    return plantDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Calculate growth progress percentage
  const calculateGrowthProgress = (plantingDate: Date | string | null, harvestDate: Date | string | null): number => {
    if (!plantingDate || !harvestDate) return 0;
    
    const plantDate = new Date(plantingDate);
    const harvest = new Date(harvestDate);
    const today = new Date();
    
    const totalGrowthTime = harvest.getTime() - plantDate.getTime();
    const elapsedTime = today.getTime() - plantDate.getTime();
    
    const progressPercentage = (elapsedTime / totalGrowthTime) * 100;
    return Math.min(100, Math.max(0, Math.round(progressPercentage)));
  };

  // Get status label and color
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "good":
      case "healthy":
        return { color: "bg-success", text: t('status_good'), textColor: "text-white" };
      case "needs_attention":
        return { color: "bg-warning", text: t('needs_attention'), textColor: "text-white" };
      case "poor":
        return { color: "bg-error", text: t('status_poor'), textColor: "text-white" };
      default:
        return { color: "bg-neutral-200", text: status, textColor: "text-neutral-700" };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3 animate-pulse">
            <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-5 bg-neutral-200 rounded w-1/4"></div>
          </div>
          
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-neutral-200 rounded-lg overflow-hidden">
                <div className="p-3 bg-neutral-50 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-neutral-200 rounded-full mr-2"></div>
                    <div className="h-5 bg-neutral-200 rounded w-32"></div>
                  </div>
                  <div className="h-5 bg-neutral-200 rounded w-16"></div>
                </div>
                <div className="p-3 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((m) => (
                      <div key={m} className="text-center space-y-1">
                        <div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto"></div>
                        <div className="h-5 bg-neutral-200 rounded w-2/3 mx-auto"></div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                    <div className="h-2 bg-neutral-200 rounded-full w-full"></div>
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
          <h2 className="text-lg font-semibold">{t('crop_status')}</h2>
          {onAddCropClick && (
            <button
              className="text-accent-500 text-sm font-medium flex items-center"
              onClick={onAddCropClick}
            >
              <span className="material-icons text-sm mr-1">add</span>
              {t('add_crop')}
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {crops.length === 0 ? (
            <p className="text-neutral-600 text-sm">{t('No crops registered')}</p>
          ) : (
            crops.map((crop) => {
              const statusInfo = getStatusInfo(crop.healthStatus || 'good');
              const growthProgress = calculateGrowthProgress(crop.plantingDate, crop.harvestDate);
              
              return (
                <div 
                  key={crop.id} 
                  className="border border-neutral-200 rounded-lg overflow-hidden cursor-pointer hover:bg-neutral-50"
                  onClick={() => onCropClick && onCropClick(crop)}
                >
                  <div className="p-3 bg-neutral-50 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="material-icons text-primary-500 mr-2">eco</span>
                      <h3 className="font-medium">
                        {crop.name} {crop.variety ? `(${crop.variety})` : ''}
                      </h3>
                    </div>
                    <span className={`text-xs ${statusInfo.color} ${statusInfo.textColor} px-2 py-0.5 rounded-full`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center">
                        <p className="text-xs text-neutral-600">{t('area')}</p>
                        <p className="font-medium">{crop.area} ha</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-neutral-600">{t('planted')}</p>
                        <p className="font-medium">{formatPlantingDate(crop.plantingDate)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-neutral-600">{t('harvest_in')}</p>
                        <p className="font-medium">
                          {getDaysUntilHarvest(crop.harvestDate)} {t('days')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-medium">{t('growth_cycle')}</p>
                        <p className="text-xs text-neutral-600">{growthProgress}% {t('complete')}</p>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`${crop.healthStatus === 'needs_attention' ? 'bg-warning' : 'bg-primary-500'} h-2 rounded-full`} 
                          style={{ width: `${growthProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {crop.healthStatus === 'needs_attention' && (
                      <div className="mt-3 p-2 bg-warning/10 rounded-lg border border-warning/20">
                        <div className="flex items-start">
                          <span className="material-icons text-warning mr-2">warning</span>
                          <p className="text-xs">Potential pest detected. Inspect field and consider treatment.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
