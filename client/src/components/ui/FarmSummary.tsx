import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Farm } from "@shared/schema";

interface StatItem {
  title: string;
  value: string | number;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
}

interface FarmSummaryProps {
  farm: Farm | null;
  stats: {
    totalCrops: number;
    activeDevices: number;
    projectedHarvest: number;
    estimatedRevenue: number;
  };
  isLoading?: boolean;
}

export default function FarmSummary({
  farm,
  stats,
  isLoading = false,
}: FarmSummaryProps) {
  const { t } = useTranslation();

  // Format trend percentage
  const formatTrend = (value: number): string => {
    const prefix = value >= 0 ? "+" : "";
    return `${prefix}${value}%`;
  };

  // Get trend color class
  const getTrendColorClass = (value: number): string => {
    return value >= 0 ? "text-success" : "text-error";
  };

  // Helper to format currency
  const formatCurrency = (value: number): string => {
    if (value >= 1000) {
      return `₹${Math.round(value / 1000)}K`;
    }
    return `₹${value}`;
  };

  // Get stat items
  const getStatItems = (): StatItem[] => [
    {
      title: t('total_crops'),
      value: stats.totalCrops,
      trend: 50, // +1 from last season
      trendLabel: "from last season",
    },
    {
      title: t('active_iot_devices'),
      value: stats.activeDevices,
      trend: 67, // +2 from last month
      trendLabel: "from last month",
    },
    {
      title: t('projected_harvest'),
      value: stats.projectedHarvest,
      suffix: "kg",
      trend: 15,
      trendLabel: "YoY",
    },
    {
      title: t('est_revenue'),
      value: formatCurrency(stats.estimatedRevenue),
      trend: 21,
      trendLabel: "YoY",
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="h-6 bg-neutral-200 rounded w-1/3 mb-3 animate-pulse"></div>
          
          <div className="relative h-40 rounded-lg overflow-hidden mb-3 bg-neutral-200 animate-pulse"></div>
          
          <div className="grid grid-cols-2 gap-3 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                  <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
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
        <h2 className="text-lg font-semibold mb-3">{t('farm_summary')}</h2>
        
        <div className="relative h-40 rounded-lg overflow-hidden mb-3">
          <img 
            src="https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
            alt="Aerial view of farm" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3 text-white">
            <h3 className="font-medium">{farm?.name || "Farm"}</h3>
            <p className="text-sm">
              {farm?.size || 0} {t('hectares')} • {stats.totalCrops} {t('active_crops')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {getStatItems().map((item, index) => (
            <div key={index} className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
              <h3 className="text-sm font-medium text-neutral-600">{item.title}</h3>
              <div className="flex items-end justify-between mt-1">
                <p className="text-2xl font-bold">
                  {item.value}
                  {item.suffix && <span className="text-sm font-normal"> {item.suffix}</span>}
                </p>
                {item.trend !== undefined && (
                  <div className={`flex items-center text-xs ${getTrendColorClass(item.trend)}`}>
                    <span className="material-icons text-xs">
                      {item.trend >= 0 ? "trending_up" : "trending_down"}
                    </span>
                    <span>{formatTrend(item.trend)} {item.trendLabel}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
