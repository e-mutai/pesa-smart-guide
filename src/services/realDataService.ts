
import axios from 'axios';
import { Fund } from './api';

// Alpha Vantage API configuration
// Note: In production, this key should be stored in environment variables
const ALPHA_VANTAGE_API_KEY = 'demo'; // Using demo key for development, replace with your key

interface AlphaVantageTimeSeriesData {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Time Zone': string;
  };
  'Monthly Time Series': {
    [date: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. volume': string;
    }
  };
}

// Updated list of Kenyan unit trust funds and their proxy symbols
const kenyanFunds = [
  {
    id: "fund1",
    name: "Money Market Fund",
    company: "CIC Asset Management",
    performancePercent: 9.8,
    risk: "Low",
    description: "Invests in short-term debt securities in the Kenyan money market. Ideal for conservative investors seeking capital preservation.",
    fee: 1.5,
    minimumInvestment: 5000,
    assetClass: "Money Market",
    symbol: "BIL", // Treasury Bills ETF as proxy
    historicalData: [] // Adding the required historicalData property with an empty array as default
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
    symbol: "KCB.NR", // Kenya Commercial Bank as proxy
    historicalData: [] // Adding the required historicalData property with an empty array as default
  },
  {
    id: "fund3",
    name: "Balanced Fund",
    company: "ICEA Lion Asset Management",
    performancePercent: 11.5,
    risk: "Medium",
    description: "Balanced exposure across equity and fixed income markets in Kenya. Provides moderate growth with reduced volatility.",
    fee: 2.0,
    minimumInvestment: 7500,
    assetClass: "Mixed Allocation",
    symbol: "AOK", // iShares Core Conservative Allocation ETF as proxy
    historicalData: [] // Adding the required historicalData property with an empty array as default
  },
  {
    id: "fund4",
    name: "Fixed Income Fund",
    company: "Sanlam Investments",
    performancePercent: 10.3,
    risk: "Low-Medium",
    description: "Invests primarily in Kenyan government and corporate bonds. Aims to provide regular income with modest capital appreciation.",
    fee: 1.8,
    minimumInvestment: 5000,
    assetClass: "Fixed Income",
    symbol: "AGG", // iShares Core U.S. Aggregate Bond ETF as proxy
    historicalData: [] // Adding the required historicalData property with an empty array as default
  },
  {
    id: "fund5",
    name: "Aggressive Growth Fund",
    company: "Old Mutual Investment Group",
    performancePercent: 16.5,
    risk: "Very High",
    description: "Focuses on high-growth sectors and companies in Kenya and East Africa with higher volatility. Suitable for long-term investors with high risk tolerance.",
    fee: 2.8,
    minimumInvestment: 15000,
    assetClass: "Equity",
    symbol: "QQQ", // Invesco QQQ Trust as proxy
    historicalData: [] // Adding the required historicalData property with an empty array as default
  },
  {
    id: "fund6",
    name: "Umoja Fund",
    company: "Cooperative Bank of Kenya",
    performancePercent: 12.7,
    risk: "Medium-High",
    description: "A diversified fund that invests in equities, fixed income, and alternative investments across Kenya and East Africa.",
    fee: 2.2,
    minimumInvestment: 10000,
    assetClass: "Mixed Allocation",
    symbol: "VBMFX", // Vanguard Total Bond Market Index Fund as proxy
    historicalData: [] // Adding the required historicalData property with an empty array as default
  },
  {
    id: "fund7",
    name: "Equity Index Fund",
    company: "GenAfrica Asset Managers",
    performancePercent: 13.8,
    risk: "High",
    description: "Tracks the performance of the Nairobi Securities Exchange (NSE) index to provide market returns.",
    fee: 1.75,
    minimumInvestment: 8000,
    assetClass: "Equity",
    symbol: "VTI", // Vanguard Total Stock Market ETF as proxy
    historicalData: [] // Adding the required historicalData property with an empty array as default
  },
  {
    id: "fund8",
    name: "Imara Money Market Fund",
    company: "Imara Asset Management",
    performancePercent: 8.9,
    risk: "Low",
    description: "Focuses on capital preservation through investments in high-quality money market instruments in Kenya.",
    fee: 1.4,
    minimumInvestment: 1000,
    assetClass: "Money Market",
    symbol: "VTIP", // Vanguard Short-Term Inflation-Protected Securities ETF as proxy
    historicalData: [] // Adding the required historicalData property with an empty array as default
  },
  {
    id: "fund9",
    name: "Cytonn High Yield Fund",
    company: "Cytonn Asset Managers",
    performancePercent: 15.2,
    risk: "High",
    description: "Targets high yields through investments in real estate projects and structured products in Kenya.",
    fee: 3.0,
    minimumInvestment: 20000,
    assetClass: "Alternative",
    symbol: "VGSIX", // Vanguard Real Estate Index Fund as proxy
    historicalData: [] // Adding the required historicalData property with an empty array as default
  }
];

// Service for fetching real financial data
export const realDataService = {
  // Fetch historical data for a specific symbol from Alpha Vantage
  fetchHistoricalData: async (symbol: string, months: number = 12): Promise<{ date: string; value: number; benchmark?: number }[]> => {
    try {
      const response = await axios.get<AlphaVantageTimeSeriesData>('https://www.alphavantage.co/query', {
        params: {
          function: 'TIME_SERIES_MONTHLY',
          symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
          datatype: 'json'
        }
      });
      
      const data = response.data;
      
      // Check if API returned an error or empty data
      if (!data || !data['Monthly Time Series']) {
        console.error('Alpha Vantage API error or rate limit reached:', data);
        throw new Error('Failed to fetch data from Alpha Vantage');
      }
      
      // Process the data into the format our app expects
      const timeSeriesData = data['Monthly Time Series'];
      const dates = Object.keys(timeSeriesData).sort().reverse().slice(0, months);
      
      // Calculate the percentage change from the first month
      const firstMonth = timeSeriesData[dates[dates.length - 1]];
      const baseValue = parseFloat(firstMonth['4. close']);
      
      // Transform data to our application's format
      const processedData = dates.map(date => {
        const monthData = timeSeriesData[date];
        const closeValue = parseFloat(monthData['4. close']);
        const percentChange = ((closeValue - baseValue) / baseValue) * 100;
        
        return {
          date: date.substring(0, 7), // YYYY-MM format
          value: parseFloat(percentChange.toFixed(2))
        };
      });
      
      // Sort chronologically
      return processedData.reverse();
    } catch (error) {
      console.error('Error fetching historical data from Alpha Vantage:', error);
      throw error;
    }
  },
  
  // Get all available Kenyan funds
  getAvailableFunds: () => {
    return kenyanFunds;
  },
  
  // Get symbol for a specific fund
  getSymbolForFund: (fundName: string): string => {
    const fund = kenyanFunds.find(f => f.name === fundName);
    return fund ? fund.symbol : 'SPY'; // Default to S&P 500 ETF
  },
  
  // Get fund by ID
  getFundById: (fundId: string): Fund | undefined => {
    return kenyanFunds.find(fund => fund.id === fundId);
  },
  
  // Enrich a fund with real historical data
  enrichFundWithRealData: async (fund: Fund): Promise<Fund> => {
    try {
      const symbol = realDataService.getSymbolForFund(fund.name);
      const historicalData = await realDataService.fetchHistoricalData(symbol);
      
      // Add benchmark data (using S&P 500 as benchmark)
      const benchmarkData = await realDataService.fetchHistoricalData('SPY', historicalData.length);
      
      // Combine fund data with benchmark
      const enrichedHistoricalData = historicalData.map((dataPoint, index) => ({
        ...dataPoint,
        benchmark: benchmarkData[index]?.value
      }));
      
      // Update the fund's historical data and calculate performance
      const updatedFund: Fund = {
        ...fund,
        historicalData: enrichedHistoricalData,
        performancePercent: historicalData[historicalData.length - 1]?.value || fund.performancePercent
      };
      
      return updatedFund;
    } catch (error) {
      console.error(`Failed to enrich fund ${fund.name} with real data:`, error);
      
      // Return the fund with empty historical data if enrichment fails
      return {
        ...fund,
        historicalData: []
      };
    }
  }
};

export default realDataService;
