
import axios from 'axios';
import { realDataService } from './realDataService';

// Setup axios with a base URL (adjust when actual backend is available)
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api'  // Production API path
    : 'http://localhost:8000/api',  // Local development FastAPI server
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
      const response = await api.post('/recommendations', profileData);
      const recommendations = response.data;
      
      // Enrich recommendations with real data
      const enrichPromises = recommendations.map((fund: Fund) => 
        realDataService.enrichFundWithRealData(fund)
      );
      
      return await Promise.all(enrichPromises);
    } catch (error) {
      console.error("Error getting recommendations from API:", error);
      throw error; // Let the caller handle the error
    }
  },
  
  // Get detailed information about a specific fund
  getFundDetails: async (fundId: string) => {
    try {
      const response = await api.get(`/funds/${fundId}`);
      const fund = response.data;
      
      // Enrich with real data
      return await realDataService.enrichFundWithRealData(fund);
    } catch (error) {
      console.error("Error getting fund details from API:", error);
      throw error; // Let the caller handle the error
    }
  },
  
  // Get all available funds
  getAllFunds: async () => {
    try {
      const response = await api.get('/funds');
      const funds = response.data;
      
      // Enrich with real data
      const enrichPromises = funds.map((fund: Fund) => 
        realDataService.enrichFundWithRealData(fund)
      );
      
      return await Promise.all(enrichPromises);
    } catch (error) {
      console.error("Error getting all funds from API:", error);
      throw error; // Let the caller handle the error
    }
  }
};

export default api;
