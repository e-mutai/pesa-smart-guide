
from pydantic import BaseModel
from typing import List, Optional

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

# ----- Fund Models -----

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
