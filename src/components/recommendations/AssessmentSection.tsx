
import React from 'react';
import RiskAssessmentForm from '@/components/forms/RiskAssessmentForm';
import { useRecommendations } from '@/contexts/RecommendationsContext';
import { apiService, RiskProfileData } from '@/services/api';
import { calculateRiskScore, getRiskCategory, filterFundsByRiskCategory } from '@/utils/riskUtils';
import { useToast } from '@/hooks/use-toast';

const AssessmentSection = () => {
  const { 
    isLoading, 
    setIsLoading, 
    setShowResults, 
    setRecommendedFunds, 
    setRiskCategory, 
    setRiskScore, 
    setSelectedFund 
  } = useRecommendations();
  const { toast } = useToast();

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
      const filteredFunds = filterFundsByRiskCategory(funds, category);
      
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

  return (
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
  );
};

export default AssessmentSection;
