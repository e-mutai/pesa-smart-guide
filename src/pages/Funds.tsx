
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FundCard from '@/components/recommendations/FundCard';
import PerformanceChart from '@/components/charts/PerformanceChart';
import { apiService, Fund } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Funds = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [filteredFunds, setFilteredFunds] = useState<Fund[]>([]);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [assetClassFilter, setAssetClassFilter] = useState('all');
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-finance-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-600">Loading funds...</p>
            </div>
          ) : (
            <div>
              {/* Filters and Search */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search funds by name or company"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                    <Select value={riskFilter} onValueChange={setRiskFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Risk Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Risk Levels</SelectItem>
                        {getUniqueRiskLevels().map((risk) => (
                          <SelectItem key={risk} value={risk}>{risk}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Class</label>
                    <Select value={assetClassFilter} onValueChange={setAssetClassFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Asset Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Asset Classes</SelectItem>
                        {getUniqueAssetClasses().map((assetClass) => (
                          <SelectItem key={assetClass} value={assetClass}>{assetClass}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Button variant="outline" onClick={resetFilters} className="w-full">
                      <Filter className="mr-2 h-4 w-4" /> Reset Filters
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Fund List */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Available Funds</h2>
                    <span className="text-sm text-gray-500">{filteredFunds.length} funds found</span>
                  </div>
                  
                  {filteredFunds.length === 0 ? (
                    <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200">
                      <p className="text-gray-600">No funds match your filters.</p>
                      <Button variant="link" onClick={resetFilters} className="mt-2">
                        Reset Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                      {filteredFunds.map((fund) => (
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
                
                {/* Fund Details */}
                <div className="lg:col-span-2">
                  {selectedFund ? (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Fund Details</h2>
                      
                      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold">{selectedFund.name}</h3>
                            <p className="text-gray-500 text-sm">{selectedFund.company}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedFund.risk === 'Low' ? 'bg-green-100 text-green-800' :
                            selectedFund.risk === 'Low-Medium' ? 'bg-blue-100 text-blue-800' :
                            selectedFund.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            selectedFund.risk === 'High' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {selectedFund.risk} Risk
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-6">{selectedFund.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-500 text-xs block">Asset Class</span>
                            <span className="font-medium">{selectedFund.assetClass}</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-500 text-xs block">Performance</span>
                            <span className={`font-medium ${selectedFund.performancePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedFund.performancePercent >= 0 ? '+' : ''}{selectedFund.performancePercent.toFixed(2)}%
                            </span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-500 text-xs block">Management Fee</span>
                            <span className="font-medium">{selectedFund.fee.toFixed(2)}%</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-500 text-xs block">Min. Investment</span>
                            <span className="font-medium">KES {selectedFund.minimumInvestment.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => navigate('/recommendations')} 
                          className="bg-finance-primary hover:bg-finance-secondary text-white w-full md:w-auto"
                        >
                          Get Personalized Recommendation
                        </Button>
                      </div>
                      
                      <Tabs defaultValue="performance" className="mt-6">
                        <TabsList className="w-full">
                          <TabsTrigger value="performance" className="flex-1">Historical Performance</TabsTrigger>
                          <TabsTrigger value="comparison" className="flex-1">Market Comparison</TabsTrigger>
                        </TabsList>
                        <TabsContent value="performance" className="mt-4">
                          <PerformanceChart 
                            data={selectedFund.historicalData} 
                            title={`${selectedFund.name} Historical Performance (12 Month)`}
                            fundName={selectedFund.name}
                          />
                        </TabsContent>
                        <TabsContent value="comparison" className="mt-4">
                          <PerformanceChart 
                            data={selectedFund.historicalData} 
                            title={`${selectedFund.name} vs Market Benchmark`}
                            fundName={selectedFund.name}
                            benchmarkName="Market Benchmark"
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200 h-full flex items-center justify-center">
                      <div>
                        <p className="text-gray-600 mb-2">Select a fund to view details</p>
                        <p className="text-sm text-gray-500">
                          {filteredFunds.length === 0 ? 
                            'No funds match your current filters.' : 
                            'Choose from the available funds on the left.'}
                        </p>
                      </div>
                    </div>
                  )}
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
