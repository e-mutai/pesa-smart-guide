
import React, { useState, useEffect } from 'react';
import { apiService, Fund } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FundFilters from '@/components/funds/FundFilters';
import FundsList from '@/components/funds/FundsList';
import FundDetailsView from '@/components/funds/FundDetailsView';
import LoadingState from '@/components/funds/LoadingState';

const Funds = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [filteredFunds, setFilteredFunds] = useState<Fund[]>([]);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [assetClassFilter, setAssetClassFilter] = useState('all');
  
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const allFunds = await apiService.getAllFunds();
        setFunds(allFunds);
        setFilteredFunds(allFunds);
        if (allFunds.length > 0) {
          setSelectedFund(allFunds[0]);
        }
      } catch (error) {
        console.error('Error fetching funds:', error);
        toast({
          title: "Error",
          description: "Could not load fund data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFunds();
  }, [toast]);
  
  useEffect(() => {
    // Filter funds based on search term and filters
    let result = funds;
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(fund => 
        fund.name.toLowerCase().includes(lowerSearchTerm) || 
        fund.company.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    if (riskFilter !== 'all') {
      result = result.filter(fund => fund.risk === riskFilter);
    }
    
    if (assetClassFilter !== 'all') {
      result = result.filter(fund => fund.assetClass === assetClassFilter);
    }
    
    setFilteredFunds(result);
    
    // Update selected fund if it's no longer in filtered list
    if (selectedFund && !result.some(fund => fund.id === selectedFund.id) && result.length > 0) {
      setSelectedFund(result[0]);
    } else if (result.length === 0) {
      setSelectedFund(null);
    }
  }, [searchTerm, riskFilter, assetClassFilter, funds, selectedFund]);
  
  const handleFundSelect = (fund: Fund) => {
    setSelectedFund(fund);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setRiskFilter('all');
    setAssetClassFilter('all');
  };
  
  const getUniqueAssetClasses = () => {
    const assetClasses = new Set(funds.map(fund => fund.assetClass));
    return Array.from(assetClasses);
  };
  
  const getUniqueRiskLevels = () => {
    const riskLevels = new Set(funds.map(fund => fund.risk));
    return Array.from(riskLevels);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Explore Investment Funds</h1>
          
          {isLoading ? (
            <LoadingState />
          ) : (
            <div>
              {/* Filters */}
              <FundFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                riskFilter={riskFilter}
                setRiskFilter={setRiskFilter}
                assetClassFilter={assetClassFilter}
                setAssetClassFilter={setAssetClassFilter}
                resetFilters={resetFilters}
                uniqueRiskLevels={getUniqueRiskLevels()}
                uniqueAssetClasses={getUniqueAssetClasses()}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Fund List */}
                <div>
                  <FundsList
                    filteredFunds={filteredFunds}
                    selectedFund={selectedFund}
                    handleFundSelect={handleFundSelect}
                    resetFilters={resetFilters}
                  />
                </div>
                
                {/* Fund Details */}
                <div className="lg:col-span-2">
                  <FundDetailsView selectedFund={selectedFund} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Funds;
