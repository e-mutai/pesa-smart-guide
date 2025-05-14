
from sqlalchemy import create_engine, Column, String, Float, Integer, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv
import logging
import json

from .models import Fund, RiskProfileData
from .utils import generate_mock_data
from .ml_models import RiskProfiler, FundMatcher, FundForecaster

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get database URL from environment or use default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/investment_app")

# Create SQLAlchemy engine and session
try:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
    logger.info("Database connection established")
except SQLAlchemyError as e:
    logger.error(f"Database connection error: {str(e)}")
    # If database connection fails, we'll use in-memory data as fallback
    engine = None
    SessionLocal = None

# Initialize ML models
risk_profiler = RiskProfiler()
forecaster = FundForecaster()

# Define SQLAlchemy models
class FundModel(Base):
    __tablename__ = "funds"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    company = Column(String, nullable=False)
    performance_percent = Column(Float)
    risk = Column(String)
    description = Column(String)
    fee = Column(Float)
    minimum_investment = Column(Float)
    asset_class = Column(String)
    historical_data = Column(JSON)

# Mock database for users (to be replaced with auth system later)
users_db = {}

# Mock database for funds as fallback
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
    # ... keep existing code (the rest of the mock funds data)
]

# Initialize fund matcher with our data
fund_matcher = None  # Will be initialized in setup_db

def get_db():
    """Get database session"""
    if SessionLocal:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    else:
        # Return None if database is not available
        yield None

def setup_db():
    """Initialize database and seed with mock data if empty"""
    global fund_matcher
    
    # If database connection is available, create tables and seed data
    if engine:
        try:
            Base.metadata.create_all(bind=engine)
            
            # Check if funds table is empty
            db = SessionLocal()
            existing_funds = db.query(FundModel).count()
            
            # If no funds exist, seed with mock data
            if existing_funds == 0:
                logger.info("Seeding database with mock fund data")
                for fund in mock_funds:
                    db_fund = FundModel(
                        id=fund["id"],
                        name=fund["name"],
                        company=fund["company"],
                        performance_percent=fund["performancePercent"],
                        risk=fund["risk"],
                        description=fund["description"],
                        fee=fund["fee"],
                        minimum_investment=fund["minimumInvestment"],
                        asset_class=fund["assetClass"],
                        historical_data=json.dumps(fund["historicalData"])
                    )
                    db.add(db_fund)
                db.commit()
            
            # Initialize fund matcher with database data
            all_funds = get_all_funds_internal(db)
            fund_matcher = FundMatcher(all_funds)
            db.close()
            
            logger.info(f"Database setup complete. {existing_funds} funds available.")
            return True
        except SQLAlchemyError as e:
            logger.error(f"Error setting up database: {str(e)}")
            # Fall back to mock data
            fund_matcher = FundMatcher(mock_funds)
            return False
    else:
        # If no database connection, use mock data
        logger.warning("No database connection. Using in-memory mock data.")
        fund_matcher = FundMatcher(mock_funds)
        return False

def get_all_funds_internal(db=None):
    """Get all funds from database or mock data if db is not available"""
    if db and engine:
        try:
            funds = db.query(FundModel).all()
            result = []
            for fund in funds:
                fund_data = {
                    "id": fund.id,
                    "name": fund.name,
                    "company": fund.company,
                    "performancePercent": fund.performance_percent,
                    "risk": fund.risk,
                    "description": fund.description,
                    "fee": fund.fee,
                    "minimumInvestment": fund.minimum_investment,
                    "assetClass": fund.asset_class,
                    "historicalData": json.loads(fund.historical_data) if isinstance(fund.historical_data, str) else fund.historical_data
                }
                result.append(fund_data)
            return result
        except SQLAlchemyError as e:
            logger.error(f"Error fetching funds from database: {str(e)}")
            # Fall back to mock data
            return mock_funds
    else:
        # If no database connection, use mock data
        return mock_funds

def get_all_funds():
    """API-compatible function to get all funds"""
    if SessionLocal and engine:
        db = SessionLocal()
        try:
            return get_all_funds_internal(db)
        finally:
            db.close()
    else:
        return mock_funds

def get_fund_by_id(fund_id: str):
    """Get a fund by ID from database or mock data"""
    if SessionLocal and engine:
        db = SessionLocal()
        try:
            fund = db.query(FundModel).filter(FundModel.id == fund_id).first()
            if fund:
                return {
                    "id": fund.id,
                    "name": fund.name,
                    "company": fund.company,
                    "performancePercent": fund.performance_percent,
                    "risk": fund.risk,
                    "description": fund.description,
                    "fee": fund.fee,
                    "minimumInvestment": fund.minimum_investment,
                    "assetClass": fund.asset_class,
                    "historicalData": json.loads(fund.historical_data) if isinstance(fund.historical_data, str) else fund.historical_data
                }
            return None
        except SQLAlchemyError as e:
            logger.error(f"Error fetching fund {fund_id} from database: {str(e)}")
            # Fall back to mock data
            fund = next((f for f in mock_funds if f["id"] == fund_id), None)
            return fund
        finally:
            db.close()
    else:
        # If no database connection, use mock data
        fund = next((f for f in mock_funds if f["id"] == fund_id), None)
        return fund

def get_fund_recommendations(profile: RiskProfileData) -> List[Fund]:
    """
    Use ML models to determine which funds to recommend based on the user's risk profile
    """
    # Get risk category from profile
    risk_category = risk_profiler.predict_risk_profile(profile.dict())
    
    # Get all funds
    all_funds = get_all_funds()
    
    # Initialize fund matcher if needed
    global fund_matcher
    if fund_matcher is None:
        fund_matcher = FundMatcher(all_funds)
    
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
    fund = get_fund_by_id(fund_id)
    if not fund:
        return None
        
    return forecaster.predict_future_performance(fund_id, fund["historicalData"], periods)

def get_fund_metrics(fund_id: str):
    """Get performance metrics for a specific fund"""
    fund = get_fund_by_id(fund_id)
    if not fund:
        return None
        
    return forecaster.get_performance_metrics(fund_id, fund["historicalData"])

# Initialize database when module is imported
setup_db()
