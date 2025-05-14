
from .models import Fund, RiskProfileData
from .utils import generate_mock_data
from typing import List
from .ml_models import RiskProfiler, FundMatcher, FundForecaster

# Initialize models
risk_profiler = RiskProfiler()
forecaster = FundForecaster()

# Mock database for users
users_db = {}

# Mock database for funds
mock_funds = [
    {
        "id": "fund1",
        "name": "Money Market Fund",
        "company": "CIC Asset Management",
        "performancePercent": 9.8,
        "risk": "Low",
        "description": "Invests in short-term debt securities in the money market. Ideal for conservative investors seeking capital preservation.",
        "fee": 1.5,
        "minimumInvestment": 5000,
        "assetClass": "Money Market",
        "historicalData": generate_mock_data(9.8, 12)
    },
    {
        "id": "fund2",
        "name": "Equity Growth Fund",
        "company": "Britam Asset Managers",
        "performancePercent": 14.2,
        "risk": "High",
        "description": "Invests primarily in Kenyan and regional equities for long-term capital growth. Higher risk with potential higher returns.",
        "fee": 2.5,
        "minimumInvestment": 10000,
        "assetClass": "Equity",
        "historicalData": generate_mock_data(14.2, 12)
    },
    {
        "id": "fund3",
        "name": "Balanced Fund",
        "company": "ICEA Lion Asset Management",
        "performancePercent": 11.5,
        "risk": "Medium",
        "description": "Balanced exposure across equity and fixed income markets. Provides moderate growth with reduced volatility.",
        "fee": 2.0,
        "minimumInvestment": 7500,
        "assetClass": "Mixed Allocation",
        "historicalData": generate_mock_data(11.5, 12)
    },
    {
        "id": "fund4",
        "name": "Fixed Income Fund",
        "company": "Sanlam Investments",
        "performancePercent": 10.3,
        "risk": "Low-Medium",
        "description": "Invests primarily in government and corporate bonds. Aims to provide regular income with modest capital appreciation.",
        "fee": 1.8,
        "minimumInvestment": 5000,
        "assetClass": "Fixed Income",
        "historicalData": generate_mock_data(10.3, 12)
    },
    {
        "id": "fund5",
        "name": "Aggressive Growth Fund",
        "company": "Old Mutual Investment Group",
        "performancePercent": -2.5,
        "risk": "Very High",
        "description": "Focuses on high-growth sectors and companies with higher volatility. Suitable for long-term investors with high risk tolerance.",
        "fee": 2.8,
        "minimumInvestment": 15000,
        "assetClass": "Equity",
        "historicalData": generate_mock_data(-2.5, 12)
    },
]

# Initialize fund matcher with our mock funds data
fund_matcher = FundMatcher(mock_funds)

def get_fund_recommendations(profile: RiskProfileData) -> List[Fund]:
    """
    Use ML models to determine which funds to recommend based on the user's risk profile
    """
    # Get risk category from profile
    risk_category = risk_profiler.predict_risk_profile(profile.dict())
    
    # Match funds based on risk category and profile
    recommended_funds = fund_matcher.match_funds(profile.dict(), risk_category)
    
    # Add forecasts to each fund
    for fund in recommended_funds:
        fund["forecast"] = forecaster.predict_future_performance(
            fund["id"], 
            fund["historicalData"]
        )
        fund["metrics"] = forecaster.get_performance_metrics(
            fund["id"],
            fund["historicalData"]
        )
        
    return recommended_funds

def get_risk_profile(profile: RiskProfileData) -> str:
    """Get risk category for a user profile"""
    return risk_profiler.predict_risk_profile(profile.dict())

def get_fund_forecast(fund_id: str, periods: int = 6):
    """Get forecast for a specific fund"""
    fund = next((f for f in mock_funds if f["id"] == fund_id), None)
    if not fund:
        return None
        
    return forecaster.predict_future_performance(fund_id, fund["historicalData"], periods)

def get_fund_metrics(fund_id: str):
    """Get performance metrics for a specific fund"""
    fund = next((f for f in mock_funds if f["id"] == fund_id), None)
    if not fund:
        return None
        
    return forecaster.get_performance_metrics(fund_id, fund["historicalData"])
