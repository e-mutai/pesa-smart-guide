
import React from 'react';
import { useRecommendations } from '@/contexts/RecommendationsContext';
import FundCard from '@/components/recommendations/FundCard';

const FundRecommendationsSidebar = () => {
  const { recommendedFunds, setSelectedFund, setShowResults } = useRecommendations();

  const viewFundDetails = (fund: any) => {
    setSelectedFund(fund);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommended Funds</h2>
      <div className="space-y-4">
        {recommendedFunds.map((fund) => (
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
        ))}
        
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
