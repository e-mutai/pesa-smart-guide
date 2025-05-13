
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PerformanceChart from '@/components/charts/PerformanceChart';
import { useRecommendations } from '@/contexts/RecommendationsContext';

const FundDetails = () => {
  const { selectedFund } = useRecommendations();

  if (!selectedFund) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Fund Performance Details</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-bold">{selectedFund.name}</h3>
        <p className="text-gray-500 text-sm mb-4">{selectedFund.company}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-gray-600 text-sm">Asset Class:</span>
            <p className="font-medium">{selectedFund.assetClass}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Risk Level:</span>
            <p className="font-medium">{selectedFund.risk}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Management Fee:</span>
            <p className="font-medium">{selectedFund.fee.toFixed(2)}%</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Minimum Investment:</span>
            <p className="font-medium">KES {selectedFund.minimumInvestment.toLocaleString()}</p>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{selectedFund.description}</p>
      </div>
      
      <Tabs defaultValue="performance">
        <TabsList className="w-full">
          <TabsTrigger value="performance" className="flex-1">Performance</TabsTrigger>
          <TabsTrigger value="comparison" className="flex-1">Market Comparison</TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="mt-4">
          <PerformanceChart 
            data={selectedFund.historicalData} 
            title={`${selectedFund.name} Performance (12 Month)`}
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
  );
};

export default FundDetails;
