
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Union

# ----- User Models -----

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

# ----- Risk Profile Models -----

class RiskProfileData(BaseModel):
    age: str
    monthlyIncome: str
    investmentGoal: str
    timeHorizon: str
    riskTolerance: int
    existingInvestments: str
    monthlyContribution: str

class RiskProfileResponse(BaseModel):
    riskCategory: str
    riskScore: int
    explanation: str

# ----- Fund Models -----

class HistoricalDataPoint(BaseModel):
    date: str
    value: float
    benchmark: Optional[float] = None

class ForecastDataPoint(BaseModel):
    date: str
    predicted_value: float
    lower_bound: float
    upper_bound: float

class PerformanceMetrics(BaseModel):
    average_return: float
    volatility: float
    sharpe_ratio: float

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
    forecast: Optional[List[ForecastDataPoint]] = None
    metrics: Optional[PerformanceMetrics] = None

class RecommendationRequest(BaseModel):
    profileData: RiskProfileData
    additionalPreferences: Optional[Dict[str, Any]] = None

class ForecastRequest(BaseModel):
    fundId: str
    periods: Optional[int] = 6
