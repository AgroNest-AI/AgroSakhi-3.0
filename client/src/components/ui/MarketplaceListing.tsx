import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { MarketplaceListing as MarketplaceListingType } from "@shared/schema";

interface MarketplaceListingCardProps {
  listings: MarketplaceListingType[];
  isLoading?: boolean;
  onNewListingClick?: () => void;
  onViewAllClick?: () => void;
  onContactSellerClick?: (listing: MarketplaceListingType) => void;
  onSaveListingClick?: (listing: MarketplaceListingType) => void;
}

export default function MarketplaceListingCard({
  listings,
  isLoading = false,
  onNewListingClick,
  onViewAllClick,
  onContactSellerClick,
  onSaveListingClick,
}: MarketplaceListingCardProps) {
  const { t } = useTranslation();

  // Format price with currency and unit
  const formatPrice = (price: number, currency: string, unit: string): JSX.Element => {
    return (
      <>
        {currency}{price.toLocaleString()}
        <span className="text-sm font-normal text-neutral-600">/{unit}</span>
      </>
    );
  };

  // Calculate price difference from MSP
  const calculatePriceDiff = (price: number, mspPrice: number): string => {
    if (!mspPrice) return "";
    
    const diffPercentage = ((price - mspPrice) / mspPrice) * 100;
    return `+${diffPercentage.toFixed(1)}% ${t('above_msp')}`;
  };

  // Helper to get a random seller image
  const getSellerImage = (userId: number): string => {
    const images = [
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
      "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
    ];
    return images[userId % images.length];
  };

  // Get seller name based on user ID (in a real app, this would come from user data)
  const getSellerName = (userId: number): string => {
    const names = ["Rajesh Kumar", "Sunita Devi", "Amit Singh", "Priya Sharma"];
    return names[userId % names.length];
  };

  // Get seller location based on user ID (in a real app, this would come from user data)
  const getSellerLocation = (userId: number): string => {
    const locations = ["Barabanki", "Lucknow", "Kanpur", "Allahabad"];
    return locations[userId % locations.length];
  };

  // Get seller rating based on user ID (in a real app, this would come from user data)
  const getSellerRating = (userId: number): number => {
    return 4.5 + (userId % 5) / 10; // Generates a number between 4.5 and 4.9
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
          
          <div className="space-y-3 animate-pulse">
            {[1, 2].map((n) => (
              <div key={n} className="border border-neutral-200 rounded-lg overflow-hidden">
                <div className="p-3 border-b border-neutral-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-neutral-200 rounded-full mr-3"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-neutral-200 rounded w-24"></div>
                      <div className="h-4 bg-neutral-200 rounded w-32"></div>
                    </div>
                  </div>
                </div>
                <div className="p-3 space-y-3">
                  <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                  <div className="flex justify-between mt-3 space-x-2">
                    <div className="h-10 bg-neutral-200 rounded flex-1"></div>
                    <div className="h-10 w-10 bg-neutral-200 rounded"></div>
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
          <h2 className="text-lg font-semibold">{t('marketplace')}</h2>
          {onNewListingClick && (
            <button
              className="text-accent-500 text-sm font-medium flex items-center"
              onClick={onNewListingClick}
            >
              <span className="material-icons text-sm mr-1">add</span>
              {t('new_listing')}
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {listings.length === 0 ? (
            <p className="text-neutral-600 text-sm">{t('No marketplace listings available')}</p>
          ) : (
            listings.map((listing) => (
              <div key={listing.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                <div className="flex items-center p-3 border-b border-neutral-100">
                  <img 
                    src={getSellerImage(listing.userId)} 
                    alt={`Seller ${listing.userId}`} 
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h3 className="font-medium">{getSellerName(listing.userId)}</h3>
                    <div className="flex items-center">
                      <span className="text-xs text-neutral-600">{getSellerLocation(listing.userId)}</span>
                      <span className="mx-1 text-neutral-300">•</span>
                      <div className="flex items-center">
                        <span className="material-icons text-xs text-secondary-500 mr-0.5">star</span>
                        <span className="text-xs">{getSellerRating(listing.userId).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {listing.isOrganic ? 'Organic ' : ''}{listing.cropName} 
                        {listing.variety ? ` (${listing.variety})` : ''}
                      </h3>
                      <p className="text-sm text-neutral-600 mt-0.5">
                        {listing.quantity} {listing.unit} {t('available')}
                      </p>
                      <div className="flex items-center mt-2">
                        {listing.isOrganic && (
                          <>
                            <span className="inline-block w-2 h-2 bg-success rounded-full mr-1"></span>
                            <span className="text-xs text-success">{t('verified_organic')}</span>
                            <span className="mx-1 text-neutral-300">|</span>
                          </>
                        )}
                        <div className="flex items-center">
                          <span className="material-icons text-xs text-accent-500 mr-0.5">link</span>
                          <span className="text-xs">{t('blockchain_certified')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {formatPrice(listing.price, listing.currency || '₹', listing.unit)}
                      </p>
                      <p className="text-xs text-success">
                        {calculatePriceDiff(listing.price, 2125)}
                      </p>
                    </div>
                  </div>
                  <div className="flex mt-3 space-x-2">
                    <button 
                      className="flex-1 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium"
                      onClick={() => onContactSellerClick && onContactSellerClick(listing)}
                    >
                      {t('contact_seller')}
                    </button>
                    <button 
                      className="px-3 py-2 border border-neutral-300 rounded-lg"
                      onClick={() => onSaveListingClick && onSaveListingClick(listing)}
                    >
                      <span className="material-icons text-neutral-600">bookmark_border</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {onViewAllClick && (
            <button
              className="w-full py-2 border border-primary-500 text-primary-500 rounded-lg flex items-center justify-center"
              onClick={onViewAllClick}
            >
              {t('view_all_listings')}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
