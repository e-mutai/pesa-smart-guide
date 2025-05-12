
import axios from 'axios';

// Setup axios with a base URL (adjust when actual backend is available)
const api = axios.create({
  baseURL: '/api', // Change this to your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define types for our API requests
export interface RiskProfileData {
  age: string;
  monthlyIncome: string;
  investmentGoal: string;
  timeHorizon: string;
  riskTolerance: number;
  existingInvestments: string;
  monthlyContribution: string;
}

export interface Fund {
  id: string;
  name: string;
  company: string;
  performancePercent: number;
  risk: string;
  description: string;
  fee: number;
  minimumInvestment: number;
  assetClass: string;
  historicalData: {
    date: string;
    value: number;
    benchmark?: number;
  }[];
}

// API functions
export const apiService = {
  // Get fund recommendations based on user profile
  getFundRecommendations: async (profileData: RiskProfileData) => {
    try {
      // This will be replaced with actual API call when backend is ready
      // For now return mock data
      console.log("Submitting profile data:", profileData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data
      return mockRecommendations;
    } catch (error) {
      console.error("Error getting recommendations:", error);
      throw error;
    }
  },
  
  // Get detailed information about a specific fund
  getFundDetails: async (fundId: string) => {
    try {
      // This will be replaced with actual API call when backend is ready
      console.log("Fetching fund details for:", fundId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the fund in our mock data
      const fund = mockRecommendations.find(f => f.id === fundId);
      if (!fund) throw new Error("Fund not found");
      
      return fund;
    } catch (error) {
      console.error("Error getting fund details:", error);
      throw error;
    }
  },
  
  // Get all available funds
  getAllFunds: async () => {
    try {
      // This will be replaced with actual API call when backend is ready
      console.log("Fetching all funds");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockRecommendations;
    } catch (error) {
      console.error("Error getting all funds:", error);
      throw error;
    }
  }
};

// Mock data for development
const mockRecommendations: Fund[] = [
  {
    id: "fund1",
    name: "Money Market Fund",
    company: "CIC Asset Management",
    performancePercent: 9.8,
    risk: "Low",
    description: "Invests in short-term debt securities in the money market. Ideal for conservative investors seeking capital preservation.",
    fee: 1.5,
    minimumInvestment: 5000,
    assetClass: "Money Market",
    historicalData: generateMockHistoricalData(9.8, 12)
  },
  {
    id: "fund2",
    name: "Equity Growth Fund",
    company: "Britam Asset Managers",
    performancePercent: 14.2,
    risk: "High",
    description: "Invests primarily in Kenyan and regional equities for long-term capital growth. Higher risk with potential higher returns.",
    fee: 2.5,
    minimumInvestment: 10000,
    assetClass: "Equity",
    historicalData: generateMockHistoricalData(14.2, 12)
  },
  {
    id: "fund3",
    name: "Balanced Fund",
    company: "ICEA Lion Asset Management",
    performancePercent: 11.5,
    risk: "Medium",
    description: "Balanced exposure across equity and fixed income markets. Provides moderate growth with reduced volatility.",
    fee: 2.0,
    minimumInvestment: 7500,
    assetClass: "Mixed Allocation",
    historicalData: generateMockHistoricalData(11.5, 12)
  },
  {
    id: "fund4",
    name: "Fixed Income Fund",
    company: "Sanlam Investments",
    performancePercent: 10.3,
    risk: "Low-Medium",
    description: "Invests primarily in government and corporate bonds. Aims to provide regular income with modest capital appreciation.",
    fee: 1.8,
    minimumInvestment: 5000,
    assetClass: "Fixed Income",
    historicalData: generateMockHistoricalData(10.3, 12)
  },
  {
    id: "fund5",
    name: "Aggressive Growth Fund",
    company: "Old Mutual Investment Group",
    performancePercent: -2.5,
    risk: "Very High",
    description: "Focuses on high-growth sectors and companies with higher volatility. Suitable for long-term investors with high risk tolerance.",
    fee: 2.8,
    minimumInvestment: 15000,
    assetClass: "Equity",
    historicalData: generateMockHistoricalData(-2.5, 12)
  },
];

// Helper function to generate mock historical data
function generateMockHistoricalData(averageReturn: number, months: number) {
  const today = new Date();
  const data = [];
  let currentValue = 100;
  let benchmarkValue = 100;
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    
    // Add some random variation to the monthly return
    const monthlyReturn = (averageReturn / 12) + (Math.random() * 2 - 1);
    const benchmarkReturn = (8.5 / 12) + (Math.random() * 1.5 - 0.75); // 8.5% benchmark with less volatility
    
    currentValue *= (1 + monthlyReturn / 100);
    benchmarkValue *= (1 + benchmarkReturn / 100);
    
    data.push({
      date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
      value: parseFloat((currentValue - 100).toFixed(2)),
      benchmark: parseFloat((benchmarkValue - 100).toFixed(2))
    });
  }
  
  return data;
}

export default api;
