
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RiskAssessmentForm from '@/components/forms/RiskAssessmentForm';
import FundCard from '@/components/recommendations/FundCard';
import RiskMeter from '@/components/charts/RiskMeter';
import PerformanceChart from '@/components/charts/PerformanceChart';
import { apiService, RiskProfileData, Fund } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Recommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendedFunds, setRecommendedFunds] = useState<Fund[]>([]);
  const [riskCategory, setRiskCategory] = useState('');
  const [riskScore, setRiskScore] = useState(0);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleFormSubmit = async (data: RiskProfileData) => {
    setIsLoading(true);
    try {
      // Determine risk score and category based on form data
      const calculatedRiskScore = calculateRiskScore(data);
      setRiskScore(calculatedRiskScore);
      
      const category = getRiskCategory(calculatedRiskScore);
      setRiskCategory(category);
      
      // Get fund recommendations
      const funds = await apiService.getFundRecommendations(data);
      
      // Filter funds based on risk category
      let filteredFunds;
      switch(category) {
        case 'Conservative':
          filteredFunds = funds.filter(fund => fund.risk === 'Low' || fund.risk === 'Low-Medium');
          break;
        case 'Moderate':
          filteredFunds = funds.filter(fund => fund.risk === 'Medium' || fund.risk === 'Low-Medium');
          break;
        case 'Balanced':
          filteredFunds = funds.filter(fund => fund.risk === 'Medium');
          break;
        case 'Growth':
          filteredFunds = funds.filter(fund => fund.risk === 'Medium' || fund.risk === 'High');
          break;
        case 'Aggressive':
          filteredFunds = funds.filter(fund => fund.risk === 'High' || fund.risk === 'Very High');
          break;
        default:
          filteredFunds = funds;
      }
      
      // If there aren't enough funds in the filtered list, add some more
      if (filteredFunds.length < 3 && funds.length > 0) {
        const remainingFunds = funds.filter(fund => !filteredFunds.includes(fund));
        filteredFunds = [...filteredFunds, ...remainingFunds].slice(0, 3);
      }
      
      setRecommendedFunds(filteredFunds);
      setSelectedFund(filteredFunds[0] || null);
      setShowResults(true);
      
      toast({
        title: "Recommendations Generated",
        description: "Based on your profile, we've found funds that match your investment goals.",
      });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Error",
        description: "There was a problem generating your recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateRiskScore = (data: RiskProfileData): number => {
    // This is a simplified risk scoring algorithm
    // In a real application, this would be more sophisticated
    let score = 0;
    
    // Age factor - younger investors can take more risk
    const age = parseInt(data.age);
    if (age < 30) score += 2;
    else if (age < 40) score += 1.5;
    else if (age < 50) score += 1;
    else if (age < 60) score += 0.5;
    
    // Time horizon
    if (data.timeHorizon === 'long') score += 2;
    else if (data.timeHorizon === 'medium') score += 1;
    
    // Direct risk tolerance input has the biggest weight
    score += data.riskTolerance * 0.6;
    
    // Investment experience
    if (data.existingInvestments === 'experienced') score += 1;
    else if (data.existingInvestments === 'some') score += 0.5;
    
    // Normalize to 1-10 scale
    return Math.max(1, Math.min(10, Math.round(score)));
  };
  
  const getRiskCategory = (score: number): string => {
    if (score <= 2) return 'Conservative';
    if (score <= 4) return 'Moderate';
    if (score <= 6) return 'Balanced';
    if (score <= 8) return 'Growth';
    return 'Aggressive';
  };

  const viewFundDetails = (fund: Fund) => {
    setSelectedFund(fund);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Personal Investment Recommendations</h1>
          
          {!showResults ? (
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Tell Us About Your Investment Goals</h2>
              <p className="text-gray-600 mb-6">
                Answer a few questions about yourself and your financial goals to receive personalized 
                fund recommendations tailored to your needs.
              </p>
              
              <RiskAssessmentForm onSubmit={handleFormSubmit} />
              
              {isLoading && (
                <div className="mt-8 text-center">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-finance-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-4 text-gray-600">Analyzing your profile and finding the best funds...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Risk Profile Summary */}
              <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Your Investment Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <p className="text-gray-600 mb-4">
                      Based on your responses, we've analyzed your investment profile and risk tolerance.
                      Here are fund recommendations that align with your {riskCategory.toLowerCase()} investor profile.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Profile Summary:</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>Risk tolerance: {riskCategory}</li>
                        <li>Recommended investment strategy: {
                          riskCategory === 'Conservative' ? 'Primarily money market and fixed income funds' :
                          riskCategory === 'Moderate' ? 'Balanced between fixed income and moderate risk funds' :
                          riskCategory === 'Balanced' ? 'Mix of fixed income and equity funds' :
                          riskCategory === 'Growth' ? 'Higher allocation to equity funds with some fixed income' :
                          'Primarily equity and aggressive growth funds'
                        }</li>
                        <li>Suggested review frequency: {
                          riskCategory === 'Conservative' || riskCategory === 'Moderate' ? 'Quarterly' : 'Monthly'
                        }</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <RiskMeter riskScore={riskScore} riskCategory={riskCategory} />
                  </div>
                </div>
              </div>
              
              {/* Fund Recommendations */}
              <div className="lg:col-span-1">
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
              
              {/* Fund Details */}
              <div className="lg:col-span-2">
                {selectedFund && (
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
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recommendations;
