
import { RiskProfileData } from '@/services/api';

export const calculateRiskScore = (data: RiskProfileData): number => {
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

export const getRiskCategory = (score: number): string => {
  if (score <= 2) return 'Conservative';
  if (score <= 4) return 'Moderate';
  if (score <= 6) return 'Balanced';
  if (score <= 8) return 'Growth';
  return 'Aggressive';
};

export const filterFundsByRiskCategory = (funds: any[], category: string) => {
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
  
  return filteredFunds;
};
