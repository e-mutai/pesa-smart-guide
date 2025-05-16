
import React, { createContext, useContext, useState } from 'react';
import { Fund, RiskProfileData } from '@/services/api';

interface RecommendationsContextType {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  showResults: boolean;
  setShowResults: (value: boolean) => void;
  recommendedFunds: Fund[];
  setRecommendedFunds: (funds: Fund[]) => void;
  riskCategory: string;
  setRiskCategory: (category: string) => void;
  riskScore: number;
  setRiskScore: (score: number) => void;
  selectedFund: Fund | null;
  setSelectedFund: (fund: Fund | null) => void;
}

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

export const RecommendationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  // Ensure recommendedFunds is always initialized as an array
  const [recommendedFunds, setRecommendedFunds] = useState<Fund[]>([]);
  const [riskCategory, setRiskCategory] = useState('');
  const [riskScore, setRiskScore] = useState(0);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);

  return (
    <RecommendationsContext.Provider value={{
      isLoading,
      setIsLoading,
      showResults,
      setShowResults,
      recommendedFunds,
      setRecommendedFunds,
      riskCategory,
      setRiskCategory,
      riskScore,
      setRiskScore,
      selectedFund,
      setSelectedFund
    }}>
      {children}
    </RecommendationsContext.Provider>
  );
};

export const useRecommendations = () => {
  const context = useContext(RecommendationsContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
};
