
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
  
  // Map stock symbols to fund names for demonstration
  // In a real application, you would have a more comprehensive mapping
  getSymbolForFund: (fundName: string): string => {
    const symbolMap: Record<string, string> = {
      'Money Market Fund': 'BIL', // Treasury Bills ETF as proxy
      'Equity Growth Fund': 'VTI', // Total Stock Market ETF
      'Balanced Fund': 'AOK', // iShares Moderate Allocation ETF
      'Fixed Income Fund': 'AGG', // iShares Core US Aggregate Bond ETF
      'Aggressive Growth Fund': 'QQQ' // Invesco QQQ Trust
    };
    
    return symbolMap[fundName] || 'SPY'; // Default to S&P 500 ETF
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
      return fund; // Return the original fund if enrichment fails
    }
  }
};
