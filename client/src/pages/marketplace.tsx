import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import MarketSummary from "@/components/ui/MarketSummary";
import BlockchainTraceability from "@/components/ui/BlockchainTraceability";
import MarketplaceListingCard from "@/components/ui/MarketplaceListing";
import { MarketplaceListing, BlockchainTransaction } from "@shared/schema";

// Sample price trend data
const samplePriceTrendData = [
  { month: "Aug", price: 1900, percentage: 60 },
  { month: "Sep", price: 1950, percentage: 65 },
  { month: "Oct", price: 2050, percentage: 75 },
  { month: "Nov", price: 2150, percentage: 85 },
  { month: "Dec", price: 2180, percentage: 90 },
  { month: "Jan", price: 2200, percentage: 95 },
  { month: "Feb", price: 2240, percentage: 100 },
];

export default function Marketplace() {
  const { t } = useTranslation();
  const { user } = useUser();
  const userId = user?.id || 1;

  // Fetch marketplace listings
  const { data: listings, isLoading: isListingsLoading } = useQuery({
    queryKey: ['/api/marketplace'],
  });

  // Fetch blockchain transactions
  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: [`/api/blockchain/${userId}`],
  });

  // Fetch market summary data
  const { data: marketPriceData, isLoading: isMarketDataLoading } = useQuery({
    queryKey: ['/api/market/prices'],
    enabled: false, // Disabled since we're using mock data for now
  });

  // Mock market price data
  const mockMarketPriceData = [
    {
      commodity: "Wheat",
      msp: 2125,
      marketPrice: 2240,
      priceChange: 5.4,
      currency: "₹",
      unit: "quintal"
    },
    {
      commodity: "Rice",
      msp: 2040,
      marketPrice: 2150,
      priceChange: 5.2,
      currency: "₹",
      unit: "quintal"
    }
  ];

  // Handler for creating a new listing
  const handleNewListing = () => {
    // In a real app, this would open a modal or form
    console.log("New listing clicked");
  };

  // Handler for viewing all listings
  const handleViewAllListings = () => {
    // In a real app, this might navigate to a detailed listings page
    console.log("View all listings clicked");
  };

  // Handler for contacting a seller
  const handleContactSeller = (listing: MarketplaceListing) => {
    // In a real app, this would open a messaging interface
    console.log("Contact seller clicked for listing:", listing.id);
  };

  // Handler for saving a listing
  const handleSaveListing = (listing: MarketplaceListing) => {
    // In a real app, this would save the listing to user favorites
    console.log("Save listing clicked for listing:", listing.id);
  };

  // Handler for viewing blockchain traceability details
  const handleViewBlockchainDetails = () => {
    // In a real app, this might navigate to a detailed blockchain view
    console.log("View blockchain details clicked");
  };

  return (
    <div className="p-4 pb-16">
      <h1 className="text-2xl font-display font-bold mb-4">{t('marketplace_title')}</h1>
      
      {/* Market Summary */}
      <MarketSummary
        priceData={marketPriceData || mockMarketPriceData}
        trendData={samplePriceTrendData}
        isLoading={isMarketDataLoading}
      />
      
      {/* Blockchain Traceability */}
      <BlockchainTraceability
        transactions={transactions || []}
        isLoading={isTransactionsLoading}
        onViewAllClick={handleViewBlockchainDetails}
      />
      
      {/* Marketplace Listings */}
      <MarketplaceListingCard
        listings={listings || []}
        isLoading={isListingsLoading}
        onNewListingClick={handleNewListing}
        onViewAllClick={handleViewAllListings}
        onContactSellerClick={handleContactSeller}
        onSaveListingClick={handleSaveListing}
      />
    </div>
  );
}
