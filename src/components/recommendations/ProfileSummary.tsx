
import React from 'react';
import { useRecommendations } from '@/contexts/RecommendationsContext';
import RiskMeter from '@/components/charts/RiskMeter';

const ProfileSummary = () => {
  const { riskCategory, riskScore } = useRecommendations();
  
  const getInvestmentStrategy = (category: string) => {
    switch (category) {
      case 'Conservative':
        return 'Primarily money market and fixed income funds';
      case 'Moderate':
        return 'Balanced between fixed income and moderate risk funds';
      case 'Balanced':
        return 'Mix of fixed income and equity funds';
      case 'Growth':
        return 'Higher allocation to equity funds with some fixed income';
      case 'Aggressive':
        return 'Primarily equity and aggressive growth funds';
      default:
        return '';
    }
  };
  
  const getReviewFrequency = (category: string) => {
    return (category === 'Conservative' || category === 'Moderate') ? 'Quarterly' : 'Monthly';
  };

  return (
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
              <li>Recommended investment strategy: {getInvestmentStrategy(riskCategory)}</li>
              <li>Suggested review frequency: {getReviewFrequency(riskCategory)}</li>
            </ul>
          </div>
        </div>
        <div>
          <RiskMeter riskScore={riskScore} riskCategory={riskCategory} />
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;
