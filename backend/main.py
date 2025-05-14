
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime, timedelta

# Initialize FastAPI app
app = FastAPI(title="Investment Recommendation API")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Models -----

class RiskProfileData(BaseModel):
    age: str
    monthlyIncome: str
    investmentGoal: str
    timeHorizon: str
    riskTolerance: int
    existingInvestments: str
    monthlyContribution: str

class HistoricalDataPoint(BaseModel):
    date: str
    value: float
    benchmark: Optional[float] = None

class Fund(BaseModel):
    id: str
    name: str
    company: str
    performancePercent: float
    risk: str
    description: str
    fee: float
    minimumInvestment: float
    assetClass: str
    historicalData: List[HistoricalDataPoint]

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# ----- Mock Database -----

# In a real implementation, this would be replaced with actual database connections
# For demo purposes, we'll use in-memory storage

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

users_db = {}

# ----- Helper Functions -----

def generate_mock_data(avg_return, months):
    """Generate mock historical data for funds"""
    today = datetime.now()
    data = []
    current_value = 100
    benchmark_value = 100
    
    for i in range(months - 1, -1, -1):
        date = today - timedelta(days=i*30)
        date_str = date.strftime("%Y-%m")
        
        # Add some random variation
        import random
        monthly_return = (avg_return / 12) + (random.random() * 2 - 1)
        benchmark_return = (8.5 / 12) + (random.random() * 1.5 - 0.75)
        
        current_value *= (1 + monthly_return / 100)
        benchmark_value *= (1 + benchmark_return / 100)
        
        data.append({
            "date": date_str,
            "value": round(current_value - 100, 2),
            "benchmark": round(benchmark_value - 100, 2)
        })
    
    return data

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

# ----- API Routes -----

@app.get("/")
def read_root():
    return {"message": "Investment Recommendation API is running"}

@app.post("/api/register")
def register_user(user: UserCreate):
    if user.email in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # In a real app, we would hash the password
    users_db[user.email] = {
        "name": user.name,
        "email": user.email,
        "password": user.password  # In production, this should be hashed!
    }
    
    # Generate a mock token
    return TokenResponse(access_token=f"mock_token_{user.email}", token_type="bearer")

@app.post("/api/login")
def login_user(user: UserLogin):
    if user.email not in users_db or users_db[user.email]["password"] != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Generate a mock token
    return TokenResponse(access_token=f"mock_token_{user.email}", token_type="bearer")

@app.post("/api/recommendations")
def get_recommendations(profile_data: RiskProfileData):
    recommendations = get_fund_recommendations(profile_data)
    return recommendations

@app.get("/api/funds")
def get_all_funds():
    return mock_funds

@app.get("/api/funds/{fund_id}")
def get_fund_details(fund_id: str):
    fund = next((f for f in mock_funds if f["id"] == fund_id), None)
    if not fund:
        raise HTTPException(status_code=404, detail="Fund not found")
    return fund

# Start the app with: uvicorn main:app --reload
