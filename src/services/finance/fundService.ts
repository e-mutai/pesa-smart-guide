
import { Fund, HistoricalDataPoint } from './types';
import { KENYAN_FUNDS } from './constants';
import { alphaVantageService } from './alphaVantageService';

/**
 * Service for handling fund-related operations
 */
export const fundService = {
  /**
   * Get all available Kenyan funds
   */
  getAvailableFunds: (): Fund[] => {
    return KENYAN_FUNDS;
  },
  
  /**
   * Get symbol for a specific fund
   */
  getSymbolForFund: (fundName: string): string => {
    const fund = KENYAN_FUNDS.find(f => f.name === fundName);
    return fund ? fund.symbol : 'SPY'; // Default to S&P 500 ETF
  },
  
  /**
   * Get fund by ID
   */
  getFundById: (fundId: string): Fund | undefined => {
    return KENYAN_FUNDS.find(fund => fund.id === fundId);
  },
  
  /**
   * Add benchmark data to historical data points
   */
  addBenchmarkData: async (
    historicalData: HistoricalDataPoint[],
  ): Promise<HistoricalDataPoint[]> => {
    try {
      // Get benchmark data with matching length
      const benchmarkData = await alphaVantageService.fetchBenchmarkData(historicalData.length);
      
      // Combine fund data with benchmark
      return historicalData.map((dataPoint, index) => ({
        ...dataPoint,
        benchmark: benchmarkData[index]?.value
      }));
    } catch (error) {
      console.error('Failed to add benchmark data:', error);
      // Return original data if benchmark addition fails
      return historicalData;
    }
  },
  
  /**
   * Enrich a fund with real historical data
   */
  enrichFundWithRealData: async (fund: Fund): Promise<Fund> => {
    try {
      const symbol = fundService.getSymbolForFund(fund.name);
      const historicalData = await alphaVantageService.fetchHistoricalData(symbol);
      
      // Add benchmark data
      const enrichedHistoricalData = await fundService.addBenchmarkData(historicalData);
      
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
