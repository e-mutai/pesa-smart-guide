
import React from 'react';
import { Button } from '@/components/ui/button';
import FundCard from '@/components/recommendations/FundCard';
import { Fund } from '@/services/api';

interface FundsListProps {
  filteredFunds: Fund[];
  selectedFund: Fund | null;
  handleFundSelect: (fund: Fund) => void;
  resetFilters: () => void;
}

const FundsList: React.FC<FundsListProps> = ({
  filteredFunds,
  selectedFund,
  handleFundSelect,
  resetFilters
}) => {
  // Safety check - ensure we're working with an array
  const funds = Array.isArray(filteredFunds) ? filteredFunds : [];
  const fundsCount = funds.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Available Funds</h2>
        <span className="text-sm text-gray-500">{fundsCount} funds found</span>
      </div>
      
      {fundsCount === 0 ? (
        <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200">
          <p className="text-gray-600">No funds match your filters.</p>
          <Button variant="link" onClick={resetFilters} className="mt-2">
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
          {funds.map((fund) => (
            <div 
              key={fund.id} 
              className={`border-2 rounded-lg transition-colors ${selectedFund?.id === fund.id ? 'border-finance-primary' : 'border-transparent'}`}
            >
              <FundCard
                name={fund.name}
                company={fund.company}
                performancePercent={fund.performancePercent}
                risk={fund.risk}
                description={fund.description}
                fee={fund.fee}
                minimumInvestment={fund.minimumInvestment}
                onClick={() => handleFundSelect(fund)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FundsList;
