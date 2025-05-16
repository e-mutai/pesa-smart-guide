
import axios from 'axios';
import { ALPHA_VANTAGE_API_KEY } from './constants';
import { AlphaVantageTimeSeriesData, HistoricalDataPoint } from './types';

/**
 * Service for interacting with Alpha Vantage API
 */
export const alphaVantageService = {
  /**
   * Fetch historical data for a specific symbol from Alpha Vantage
   */
  fetchHistoricalData: async (
    symbol: string, 
    months: number = 12
  ): Promise<HistoricalDataPoint[]> => {
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

  /**
   * Fetch benchmark data (S&P 500) for comparison
   */
  fetchBenchmarkData: async (months: number = 12): Promise<HistoricalDataPoint[]> => {
    // Using S&P 500 ETF as the benchmark
    return alphaVantageService.fetchHistoricalData('SPY', months);
  }
};
