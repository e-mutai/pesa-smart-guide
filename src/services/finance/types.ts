
// Define types used across financial services

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
  symbol: string;
  historicalData: HistoricalDataPoint[];
}

export interface HistoricalDataPoint {
  date: string;
  value: number;
  benchmark?: number;
}

export interface AlphaVantageTimeSeriesData {
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
