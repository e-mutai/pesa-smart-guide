from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from .models import (
    RiskProfileData, UserCreate, UserLogin, TokenResponse,
    RiskProfileResponse, Fund, RecommendationRequest, ForecastRequest
)
from .database import (
    users_db, get_all_funds, get_fund_by_id, get_fund_recommendations, 
    get_risk_profile, get_fund_forecast, get_fund_metrics, get_db
)

# Create router
router = APIRouter()

# ----- API Routes -----

@router.get("/")
def read_root():
    return {"message": "Investment Recommendation API is running"}

@router.post("/api/register")
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

@router.post("/api/login")
def login_user(user: UserLogin):
    if user.email not in users_db or users_db[user.email]["password"] != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Generate a mock token
    return TokenResponse(access_token=f"mock_token_{user.email}", token_type="bearer")

@router.post("/api/recommendations")
def get_recommendations(profile_data: RiskProfileData, db: Session = Depends(get_db)):
    recommendations = get_fund_recommendations(profile_data)
    return recommendations

@router.post("/api/risk-profile")
def analyze_risk_profile(profile_data: RiskProfileData):
    risk_category = get_risk_profile(profile_data)
    
    # Generate appropriate explanation based on risk category
    explanations = {
        "Conservative": "Your profile indicates a preference for stability and capital preservation. Conservative investments typically have lower returns but also lower risk of losses.",
        "Moderate": "Your profile suggests a balanced approach to risk, with a preference for some stability while accepting moderate risk for potential growth.",
        "Balanced": "You have a balanced risk profile, willing to accept market fluctuations for long-term growth potential while maintaining some stability.",
        "Growth": "Your profile indicates comfort with taking calculated risks for higher growth potential, understanding that investments may experience significant volatility.",
        "Aggressive": "You have a high risk tolerance, prioritizing maximum growth potential while accepting the possibility of significant market fluctuations."
    }
    
    # Map risk category to risk score
    risk_scores = {
        "Conservative": 2,
        "Moderate": 4, 
        "Balanced": 6,
        "Growth": 8,
        "Aggressive": 10
    }
    
    return RiskProfileResponse(
        riskCategory=risk_category,
        riskScore=risk_scores.get(risk_category, 5),
        explanation=explanations.get(risk_category, "Your risk profile has been analyzed based on your financial situation and preferences.")
    )

@router.get("/api/funds")
def get_all_funds_api(db: Session = Depends(get_db)):
    return get_all_funds()

@router.get("/api/funds/{fund_id}")
def get_fund_details(fund_id: str, db: Session = Depends(get_db)):
    fund = get_fund_by_id(fund_id)
    if not fund:
        raise HTTPException(status_code=404, detail="Fund not found")
    return fund

@router.post("/api/forecast")
def forecast_fund_performance(request: ForecastRequest, db: Session = Depends(get_db)):
    forecast = get_fund_forecast(request.fundId, request.periods)
    if not forecast:
        raise HTTPException(status_code=404, detail="Fund not found")
    return {"forecast": forecast}

@router.get("/api/funds/{fund_id}/metrics")
def get_fund_performance_metrics(fund_id: str, db: Session = Depends(get_db)):
    metrics = get_fund_metrics(fund_id)
    if not metrics:
        raise HTTPException(status_code=404, detail="Fund not found")
    return metrics
