
// Financial service constants

// Alpha Vantage API configuration
// Note: In production, this key should be stored in environment variables
export const ALPHA_VANTAGE_API_KEY = 'demo'; // Using demo key for development

// Kenyan funds with their proxy symbols for Alpha Vantage API
export const KENYAN_FUNDS = [
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
    historicalData: []
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
    historicalData: []
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
    historicalData: []
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
    historicalData: []
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
    historicalData: []
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
    historicalData: []
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
    historicalData: []
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
    historicalData: []
  }
];
