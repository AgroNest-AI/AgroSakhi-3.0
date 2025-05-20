import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

// Type to represent market price data
interface MarketPriceData {
  commodity: string;
  msp: number;
  marketPrice: number;
  priceChange: number;
  currency: string;
  unit: string;
}

// Type to represent price trend data
interface PriceTrendData {
  month: string;
  price: number;
  percentage: number;
}

interface MarketSummaryProps {
  priceData: MarketPriceData[];
  trendData: PriceTrendData[];
  isLoading?: boolean;
}

export default function MarketSummary({
  priceData,
  trendData,
  isLoading = false,
}: MarketSummaryProps) {
  const { t } = useTranslation();

  // Format price with currency
  const formatPrice = (price: number, currency: string = "₹"): string => {
    return `${currency}${price.toLocaleString()}`;
  };

  // Format price change percentage
  const formatPriceChange = (change: number): string => {
    const prefix = change >= 0 ? "+" : "";
    return `${prefix}${change.toFixed(1)}%`;
  };

  // Get CSS class for price change
  const getPriceChangeClass = (change: number): string => {
    return change >= 0 ? "text-success" : "text-error";
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="h-6 bg-neutral-200 rounded w-1/3 mb-4 animate-pulse"></div>
          
          <div className="space-y-4">
            <div className="flex justify-between animate-pulse">
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-32"></div>
                <div className="h-6 bg-neutral-200 rounded w-24"></div>
              </div>
              <div className="space-y-2 text-right">
                <div className="h-4 bg-neutral-200 rounded w-32"></div>
                <div className="h-6 bg-neutral-200 rounded w-24"></div>
              </div>
            </div>
            
            <div className="h-24 bg-neutral-100 rounded animate-pulse mt-6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-md mb-4">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">{t('market_summary')}</h2>
        
        <div className="space-y-3">
          {priceData.length === 0 ? (
            <p className="text-neutral-600 text-sm">{t('No market data available')}</p>
          ) : (
            priceData.map((item, index) => (
              <div key={index} className={`flex justify-between ${
                index > 0 ? 'mt-2 pt-2 border-t border-neutral-200' : ''
              }`}>
                <div>
                  <p className="text-sm text-neutral-600">
                    {t('today_msp')} ({item.commodity})
                  </p>
                  <p className="text-xl font-bold">
                    {formatPrice(item.msp, item.currency)}
                    <span className="text-sm font-normal text-neutral-600">/{item.unit}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-600">{t('market_price')}</p>
                  <p className="text-xl font-bold">
                    {formatPrice(item.marketPrice, item.currency)}
                    <span className={`text-sm font-normal ${getPriceChangeClass(item.priceChange)} ml-1`}>
                      {formatPriceChange(item.priceChange)}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {trendData.length > 0 && (
          <div className="mt-4 pt-3 border-t border-neutral-200">
            <h3 className="text-sm font-medium mb-2">
              {t('price_trend')} ({priceData[0]?.commodity || 'Wheat'})
            </h3>
            <div className="h-24 flex items-end justify-between">
              {trendData.map((data, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center" 
                  style={{ width: `calc(100% / ${trendData.length} - 8px)` }}
                >
                  <div 
                    className={`w-full bg-accent-${200 + (index * 100)} rounded-t-sm chart-bar`} 
                    style={{ height: `${data.percentage}%` }}
                  ></div>
                  <p className="text-xs mt-1 text-neutral-500">{data.month}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
