
import React from 'react';
import { useRecommendations } from '@/contexts/RecommendationsContext';
import FundCard from '@/components/recommendations/FundCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const FundRecommendationsSidebar = () => {
  const { recommendedFunds, setSelectedFund, setShowResults, isLoading, error } = useRecommendations();

  const viewFundDetails = (fund: any) => {
    setSelectedFund(fund);
  };

  // Make sure recommendedFunds is an array and has contents
  const hasRecommendations = Array.isArray(recommendedFunds) && recommendedFunds.length > 0;

  // Rendering loading skeletons when data is being fetched
  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Recommended Funds</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-[250px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Show error state if there was a problem fetching recommendation data
  if (error) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Recommended Funds</h2>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not load fund recommendations. Please try again later.
          </AlertDescription>
        </Alert>
        <button 
          onClick={() => setShowResults(false)}
          className="text-finance-primary hover:text-finance-secondary font-medium"
        >
          Retake Assessment
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommended Funds</h2>
      <div className="space-y-4">
        {hasRecommendations ? (
          recommendedFunds.map((fund) => (
            <FundCard
              key={fund.id}
              name={fund.name}
              company={fund.company}
              performancePercent={fund.performancePercent}
              risk={fund.risk}
              description={fund.description}
              fee={fund.fee}
              minimumInvestment={fund.minimumInvestment}
              onClick={() => viewFundDetails(fund)}
            />
          ))
        ) : (
          <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-2">No recommended funds available based on your profile.</p>
            <p className="text-sm text-gray-400">This could be due to insufficient market data or restrictive criteria.</p>
          </div>
        )}
        
        <div className="mt-8">
          <button 
            onClick={() => setShowResults(false)}
            className="text-finance-primary hover:text-finance-secondary font-medium flex items-center"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundRecommendationsSidebar;
