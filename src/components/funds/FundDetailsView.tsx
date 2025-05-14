
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PerformanceChart from '@/components/charts/PerformanceChart';
import { Fund } from '@/services/api';

interface FundDetailsViewProps {
  selectedFund: Fund | null;
}

const FundDetailsView: React.FC<FundDetailsViewProps> = ({ selectedFund }) => {
  const navigate = useNavigate();

  if (!selectedFund) {
    return (
      <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200 h-full flex items-center justify-center">
        <div>
          <p className="text-gray-600 mb-2">Select a fund to view details</p>
          <p className="text-sm text-gray-500">Choose from the available funds on the left.</p>
        </div>
      </div>
    );
  }

  return (
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
  );
};

export default FundDetailsView;
