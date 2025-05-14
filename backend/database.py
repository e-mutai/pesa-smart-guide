
from .models import Fund, RiskProfileData
from .utils import generate_mock_data
from typing import List

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
    }
]

def get_fund_recommendations(profile: RiskProfileData) -> List[Fund]:
    """
    Determine which funds to recommend based on the user's risk profile
    In a real app, this would use a more sophisticated algorithm
    """
    recommended_funds = []
    
    # Simple logic - match based on risk tolerance
    if profile.riskTolerance <= 3:
        # Low risk - Money Market Fund
        recommended_funds.append(next(f for f in mock_funds if f["id"] == "fund1"))
    elif profile.riskTolerance <= 7:
        # Medium risk - Balanced Fund
        recommended_funds.append(next(f for f in mock_funds if f["id"] == "fund3"))
    else:
        # High risk - Equity Growth Fund
        recommended_funds.append(next(f for f in mock_funds if f["id"] == "fund2"))
    
    return recommended_funds
