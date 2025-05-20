import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { BlockchainTransaction } from "@shared/schema";

interface BlockchainTraceabilityProps {
  transactions: BlockchainTransaction[];
  isLoading?: boolean;
  onViewAllClick?: () => void;
}

export default function BlockchainTraceability({
  transactions,
  isLoading = false,
  onViewAllClick,
}: BlockchainTraceabilityProps) {
  const { t } = useTranslation();

  // Format date for display
  const formatTransactionDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get icon for transaction type
  const getTransactionIcon = (type: string): string => {
    switch (type) {
      case "harvest":
        return "agriculture";
      case "quality_check":
        return "inventory_2";
      case "market_listing":
        return "shopping_cart";
      case "sale":
        return "paid";
      default:
        return "link";
    }
  };

  // Get background color for transaction type
  const getTransactionColor = (type: string): string => {
    switch (type) {
      case "harvest":
        return "bg-accent-500";
      case "quality_check":
        return "bg-primary-500";
      case "market_listing":
        return "bg-secondary-500";
      case "sale":
        return "bg-success";
      default:
        return "bg-neutral-500";
    }
  };

  // Get display title for transaction type
  const getTransactionTitle = (type: string): string => {
    switch (type) {
      case "harvest":
        return t('harvest_recorded');
      case "quality_check":
        return t('quality_check');
      case "market_listing":
        return t('market_listing');
      case "sale":
        return t('Sale Completed');
      default:
        return type;
    }
  };

  // Extract details from transaction for display
  const getTransactionDetails = (transaction: BlockchainTransaction): string => {
    if (!transaction.details) return "";
    
    // Details is stored as JSON, parse if needed
    const details = typeof transaction.details === 'string' 
      ? JSON.parse(transaction.details) 
      : transaction.details;
    
    switch (transaction.transactionType) {
      case "harvest":
        return `${details.quantity} ${details.crop} (${details.variety})`;
      case "quality_check":
        return `Grade ${details.grade} - Moisture: ${details.moisture}, Protein: ${details.protein}`;
      case "market_listing":
        return `Listed ${details.quantity} at ${details.price}`;
      case "sale":
        return `Sold to ${details.buyer} at ${details.price}`;
      default:
        return JSON.stringify(details);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3 animate-pulse">
            <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
            <div className="h-5 bg-neutral-200 rounded w-1/4"></div>
          </div>
          
          <div className="relative animate-pulse">
            <div className="absolute top-0 bottom-0 left-5 border-l-2 border-dashed border-neutral-300"></div>
            
            {[1, 2, 3].map((n) => (
              <div key={n} className="relative flex mb-4">
                <div className="w-10 h-10 rounded-full bg-neutral-200 z-10"></div>
                <div className="ml-4 flex-1">
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                    <div className="h-5 bg-neutral-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="h-10 bg-neutral-200 rounded-lg w-full mt-4"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-md mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">{t('blockchain_traceability')}</h2>
          <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
            Polygon Chain
          </span>
        </div>
        
        {transactions.length === 0 ? (
          <p className="text-neutral-600 text-sm mb-4">{t('No blockchain transactions available')}</p>
        ) : (
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-5 border-l-2 border-dashed border-neutral-300"></div>
            
            {transactions.map((transaction, index) => (
              <div key={transaction.id} className="relative flex mb-4">
                <div className={`w-10 h-10 rounded-full ${getTransactionColor(transaction.transactionType)} flex items-center justify-center z-10`}>
                  <span className="material-icons text-white">
                    {getTransactionIcon(transaction.transactionType)}
                  </span>
                </div>
                <div className="ml-4 flex-1">
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {getTransactionTitle(transaction.transactionType)}
                        </h3>
                        <p className="text-xs text-neutral-600 mt-1">
                          {getTransactionDetails(transaction)}
                        </p>
                      </div>
                      <span className="text-xs bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">
                        {formatTransactionDate(transaction.timestamp || new Date())}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-neutral-500">
                      <span className="material-icons text-xs mr-1">link</span>
                      <span className="font-mono">{transaction.transactionHash}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button
          className="w-full mt-4 py-2 border border-accent-500 text-accent-500 rounded-lg flex items-center justify-center"
          onClick={onViewAllClick}
        >
          {t('view_traceability')}
        </button>
      </CardContent>
    </Card>
  );
}
