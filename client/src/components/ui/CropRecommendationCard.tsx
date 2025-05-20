import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { CropRecommendation } from "@shared/schema";

interface CropRecommendationCardProps {
  recommendations: CropRecommendation[];
  isLoading?: boolean;
  onViewAllClick?: () => void;
}

export default function CropRecommendationCard({
  recommendations,
  isLoading = false,
  onViewAllClick,
}: CropRecommendationCardProps) {
  const { t } = useTranslation();

  // Status color mapping
  const getMatchColor = (matchPercentage: number): string => {
    if (matchPercentage >= 90) return "bg-success";
    if (matchPercentage >= 80) return "bg-accent-500";
    return "bg-warning";
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="h-6 bg-neutral-200 rounded w-1/2 mb-3 animate-pulse"></div>
          <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4 animate-pulse"></div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex border border-neutral-200 rounded-lg overflow-hidden animate-pulse">
                <div className="w-20 h-20 bg-neutral-200"></div>
                <div className="flex-1 p-3 space-y-2">
                  <div className="h-5 bg-neutral-200 rounded w-1/2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                </div>
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
        <h2 className="text-lg font-semibold mb-3">{t('crop_recommendations')}</h2>
        <p className="text-sm text-neutral-600 mb-4">{t('crop_recommendation_subtitle')}</p>
        
        <div className="space-y-3">
          {recommendations.length === 0 ? (
            <p className="text-neutral-600 text-sm">
              {t('No crop recommendations available')}
            </p>
          ) : (
            recommendations.map((crop) => (
              <div key={crop.id} className="flex border border-neutral-200 rounded-lg overflow-hidden">
                <div className="w-20 bg-neutral-100 flex items-center justify-center">
                  <span className="material-icons text-3xl text-primary-500">eco</span>
                </div>
                <div className="flex-1 p-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">
                      {crop.cropName} {crop.variety ? `(${crop.variety})` : ''}
                    </h3>
                    <span className={`text-xs ${getMatchColor(crop.matchPercentage || 0)} text-white px-2 py-0.5 rounded-full`}>
                      {crop.matchPercentage}% {t('match')}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">{crop.reason}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <button
          className="w-full mt-4 py-2 bg-primary-500 text-white rounded-lg flex items-center justify-center"
          onClick={onViewAllClick}
        >
          {t('view_all_recommendations')}
        </button>
      </CardContent>
    </Card>
  );
}
