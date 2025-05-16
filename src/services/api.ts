
import axios from 'axios';
import { realDataService, Fund } from './finance';

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

// Re-export Fund type for compatibility
export type { Fund };

// API functions
export const apiService = {
  // Get fund recommendations based on user profile
  getFundRecommendations: async (profileData: RiskProfileData) => {
    try {
      // Instead of calling a backend API, use the real data service directly
      const allFunds = realDataService.getAvailableFunds();
      
      // For now, just return all funds as recommendations
      // In a real app, this would use the profile data to filter funds
      const recommendations = allFunds.slice(0, 3); // Return top 3 funds as recommendations
      
      // Enrich recommendations with real data
      const enrichPromises = recommendations.map((fund: Fund) => 
        realDataService.enrichFundWithRealData(fund)
      );
      
      return await Promise.all(enrichPromises);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      throw error; // Let the caller handle the error
    }
  },
  
  // Get detailed information about a specific fund
  getFundDetails: async (fundId: string) => {
    try {
      // Use real data service to get fund by ID
      const fund = realDataService.getFundById(fundId);
      
      if (!fund) {
        throw new Error(`Fund with ID ${fundId} not found`);
      }
      
      // Enrich with real data
      return await realDataService.enrichFundWithRealData(fund);
    } catch (error) {
      console.error("Error getting fund details:", error);
      throw error; // Let the caller handle the error
    }
  },
  
  // Get all available funds
  getAllFunds: async () => {
    try {
      // Use real data service directly instead of API call
      const funds = realDataService.getAvailableFunds();
      
      // Enrich with real data
      const enrichPromises = funds.map((fund: Fund) => 
        realDataService.enrichFundWithRealData(fund)
      );
      
      return await Promise.all(enrichPromises);
    } catch (error) {
      console.error("Error getting all funds:", error);
      throw error; // Let the caller handle the error
    }
  }
};

export default api;
