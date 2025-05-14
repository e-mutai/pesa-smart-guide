
from fastapi import APIRouter, HTTPException, status
from .models import RiskProfileData, UserCreate, UserLogin, TokenResponse
from .database import users_db, mock_funds, get_fund_recommendations

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
def get_recommendations(profile_data: RiskProfileData):
    recommendations = get_fund_recommendations(profile_data)
    return recommendations

@router.get("/api/funds")
def get_all_funds():
    return mock_funds

@router.get("/api/funds/{fund_id}")
def get_fund_details(fund_id: str):
    fund = next((f for f in mock_funds if f["id"] == fund_id), None)
    if not fund:
        raise HTTPException(status_code=404, detail="Fund not found")
    return fund
