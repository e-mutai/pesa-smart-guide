
from datetime import datetime, timedelta
import requests
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Alpha Vantage API key (should be moved to environment variable in production)
ALPHA_VANTAGE_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY', 'demo')

# Mapping of Kenyan fund names to proxy symbols for Alpha Vantage API
KENYAN_FUND_SYMBOLS = {
    "Money Market Fund": "BIL",  # Treasury Bills ETF
    "Equity Growth Fund": "KCB.NR",  # Kenya Commercial Bank
    "Balanced Fund": "AOK",  # iShares Core Conservative Allocation ETF
    "Fixed Income Fund": "AGG",  # iShares Core U.S. Aggregate Bond ETF
    "Aggressive Growth Fund": "QQQ",  # Invesco QQQ Trust
    "Umoja Fund": "VBMFX",  # Vanguard Total Bond Market Index Fund
    "Equity Index Fund": "VTI",  # Vanguard Total Stock Market ETF
    "Imara Money Market Fund": "VTIP",  # Vanguard Short-Term Inflation-Protected Securities ETF
    "Cytonn High Yield Fund": "VGSIX"  # Vanguard Real Estate Index Fund
}

def fetch_real_historical_data(symbol, months=12):
    """Fetch real historical market data for a given symbol using Alpha Vantage API"""
    try:
        url = "https://www.alphavantage.co/query"
        params = {
            'function': 'TIME_SERIES_MONTHLY',
            'symbol': symbol,
            'apikey': ALPHA_VANTAGE_API_KEY,
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        # Check if API returned an error
        if "Error Message" in data:
            logger.error(f"Alpha Vantage API error for symbol {symbol}: {data['Error Message']}")
            return None
            
        if "Monthly Time Series" not in data:
            logger.error(f"No time series data returned for symbol {symbol}")
            return None
            
        # Process the data
        time_series = data["Monthly Time Series"]
        dates = list(time_series.keys())
        dates.sort(reverse=True)
        dates = dates[:months]
        
        # Calculate percentage change from first month
        first_month = time_series[dates[-1]]
        base_value = float(first_month["4. close"])
        
        result = []
        for date in dates:
            month_data = time_series[date]
            close_value = float(month_data["4. close"])
            percent_change = ((close_value - base_value) / base_value) * 100
            
            result.append({
                "date": date[:7],  # YYYY-MM format
                "value": round(percent_change, 2)
            })
            
        return result
        
    except Exception as e:
        logger.error(f"Error fetching real data for {symbol}: {str(e)}")
        return None

def get_benchmark_data(months=12):
    """Get market benchmark data (S&P 500) for comparison"""
    return fetch_real_historical_data("SPY", months)

def enrich_with_benchmark(historical_data):
    """Add benchmark data to historical data points"""
    if not historical_data:
        return historical_data
        
    # Get benchmark data with the same length
    benchmark_data = get_benchmark_data(len(historical_data))
    
    # Add benchmark to each data point
    for i, data_point in enumerate(historical_data):
        if i < len(benchmark_data):
            data_point["benchmark"] = benchmark_data[i]["value"]
            
    return historical_data

def get_symbol_for_fund(fund_name):
    """Map fund names to stock symbols for fetching real data"""
    return KENYAN_FUND_SYMBOLS.get(fund_name, "SPY")  # Default to S&P 500
