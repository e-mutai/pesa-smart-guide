
from sqlalchemy import create_engine, Column, String, Float, Integer, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv
import logging
import json
import requests

from .models import Fund, RiskProfileData
from .utils import utils
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
    # If database connection fails, we'll use API data as fallback
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

# List of Kenyan unit trust funds with their proxy symbols for Alpha Vantage API
kenyan_funds = [
    {
        "id": "fund1",
        "name": "Money Market Fund",
        "company": "CIC Asset Management",
        "performancePercent": 9.8,
        "risk": "Low",
        "description": "Invests in short-term debt securities in the Kenyan money market. Ideal for conservative investors seeking capital preservation.",
        "fee": 1.5,
        "minimumInvestment": 5000,
        "assetClass": "Money Market",
        "symbol": "BIL"  # Treasury Bills ETF as proxy
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
        "symbol": "KCB.NR"  # Kenya Commercial Bank as proxy
    },
    {
        "id": "fund3",
        "name": "Balanced Fund",
        "company": "ICEA Lion Asset Management",
        "performancePercent": 11.5,
        "risk": "Medium",
        "description": "Balanced exposure across equity and fixed income markets in Kenya. Provides moderate growth with reduced volatility.",
        "fee": 2.0,
        "minimumInvestment": 7500,
        "assetClass": "Mixed Allocation",
        "symbol": "AOK"  # iShares Core Conservative Allocation ETF as proxy
    },
    {
        "id": "fund4",
        "name": "Fixed Income Fund",
        "company": "Sanlam Investments",
        "performancePercent": 10.3,
        "risk": "Low-Medium",
        "description": "Invests primarily in Kenyan government and corporate bonds. Aims to provide regular income with modest capital appreciation.",
        "fee": 1.8,
        "minimumInvestment": 5000,
        "assetClass": "Fixed Income",
        "symbol": "AGG"  # iShares Core U.S. Aggregate Bond ETF as proxy
    },
    {
        "id": "fund5",
        "name": "Aggressive Growth Fund",
        "company": "Old Mutual Investment Group",
        "performancePercent": 16.5,
        "risk": "Very High",
        "description": "Focuses on high-growth sectors and companies in Kenya and East Africa with higher volatility. Suitable for long-term investors with high risk tolerance.",
        "fee": 2.8,
        "minimumInvestment": 15000,
        "assetClass": "Equity",
        "symbol": "QQQ"  # Invesco QQQ Trust as proxy
    },
    {
        "id": "fund6",
        "name": "Umoja Fund",
        "company": "Cooperative Bank of Kenya",
        "performancePercent": 12.7,
        "risk": "Medium-High",
        "description": "A diversified fund that invests in equities, fixed income, and alternative investments across Kenya and East Africa.",
        "fee": 2.2,
        "minimumInvestment": 10000,
        "assetClass": "Mixed Allocation",
        "symbol": "VBMFX"  # Vanguard Total Bond Market Index Fund as proxy
    },
    {
        "id": "fund7",
        "name": "Equity Index Fund",
        "company": "GenAfrica Asset Managers",
        "performancePercent": 13.8,
        "risk": "High",
        "description": "Tracks the performance of the Nairobi Securities Exchange (NSE) index to provide market returns.",
        "fee": 1.75,
        "minimumInvestment": 8000,
        "assetClass": "Equity",
        "symbol": "VTI"  # Vanguard Total Stock Market ETF as proxy
    },
    {
        "id": "fund8",
        "name": "Imara Money Market Fund",
        "company": "Imara Asset Management",
        "performancePercent": 8.9,
        "risk": "Low",
        "description": "Focuses on capital preservation through investments in high-quality money market instruments in Kenya.",
        "fee": 1.4,
        "minimumInvestment": 1000,
        "assetClass": "Money Market",
        "symbol": "VTIP"  # Vanguard Short-Term Inflation-Protected Securities ETF as proxy
    },
    {
        "id": "fund9",
        "name": "Cytonn High Yield Fund",
        "company": "Cytonn Asset Managers",
        "performancePercent": 15.2,
        "risk": "High",
        "description": "Targets high yields through investments in real estate projects and structured products in Kenya.",
        "fee": 3.0,
        "minimumInvestment": 20000,
        "assetClass": "Alternative",
        "symbol": "VGSIX"  # Vanguard Real Estate Index Fund as proxy
    }
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
    """Initialize database and seed with Kenyan funds data if empty"""
    global fund_matcher
    
    # If database connection is available, create tables and seed data
    if engine:
        try:
            Base.metadata.create_all(bind=engine)
            
            # Check if funds table is empty
            db = SessionLocal()
            existing_funds = db.query(FundModel).count()
            
            # If no funds exist, seed with Kenyan funds data
            if existing_funds == 0:
                logger.info("Seeding database with Kenyan funds data")
                for fund in kenyan_funds:
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
                        historical_data="{}"  # Empty at first, will be populated with real data
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
            # Fall back to direct API data
            fund_matcher = FundMatcher(kenyan_funds)
            return False
    else:
        # If no database connection, use API data directly
        logger.warning("No database connection. Using API data directly.")
        fund_matcher = FundMatcher(kenyan_funds)
        return False

def get_all_funds_internal(db=None):
    """Get all funds from database or API data if db is not available"""
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
            # Fall back to API data
            return kenyan_funds
    else:
        # If no database connection, use API data
        return kenyan_funds

def get_all_funds():
    """API-compatible function to get all funds"""
    if SessionLocal and engine:
        db = SessionLocal()
        try:
            return get_all_funds_internal(db)
        finally:
            db.close()
    else:
        return kenyan_funds

def get_fund_by_id(fund_id: str):
    """Get a fund by ID from database or API data"""
    fund = None
    
    if SessionLocal and engine:
        db = SessionLocal()
        try:
            fund = db.query(FundModel).filter(FundModel.id == fund_id).first()
            if fund:
                fund = {
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
        except SQLAlchemyError as e:
            logger.error(f"Error fetching fund {fund_id} from database: {str(e)}")
            # Fall back to API data
            fund = next((f for f in kenyan_funds if f["id"] == fund_id), None)
        finally:
            db.close()
    else:
        # If no database connection, use API data
        fund = next((f for f in kenyan_funds if f["id"] == fund_id), None)
    
    # Try to enrich fund with real data
    if fund:
        try:
            # Find the symbol for this fund
            fund_symbol = None
            for kf in kenyan_funds:
                if kf["id"] == fund["id"] or kf["name"] == fund["name"]:
                    fund_symbol = kf.get("symbol")
                    break
            
            symbol = fund_symbol or utils.get_symbol_for_fund(fund["name"])
            real_data = utils.fetch_real_historical_data(symbol)
            
            if real_data:
                # Update with real historical data
                fund["historicalData"] = utils.enrich_with_benchmark(real_data)
                
                # Update performance percentage based on the latest data point
                if len(real_data) > 0:
                    fund["performancePercent"] = real_data[-1]["value"]
                    logger.info(f"Updated fund {fund['name']} with real market data")
        except Exception as e:
            logger.error(f"Error enriching fund with real data: {str(e)}")
    
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
    
    # Try to enrich funds with real data when possible
    for fund in recommended_funds:
        try:
            # Find the symbol for this fund
            fund_symbol = None
            for kf in kenyan_funds:
                if kf["id"] == fund["id"] or kf["name"] == fund["name"]:
                    fund_symbol = kf.get("symbol")
                    break
                
            symbol = fund_symbol or utils.get_symbol_for_fund(fund["name"])
            real_data = utils.fetch_real_historical_data(symbol)
            
            if real_data:
                # Update with real historical data
                fund["historicalData"] = utils.enrich_with_benchmark(real_data)
                
                # Update performance percentage based on the latest data point
                if real_data and len(real_data) > 0:
                    fund["performancePercent"] = real_data[-1]["value"]
                    logger.info(f"Updated fund {fund['name']} with real market data")
            else:
                logger.info(f"No real data available for {fund['name']}, using forecaster")
        except Exception as e:
            logger.error(f"Error fetching real data for {fund['name']}: {str(e)}")
            # Continue with existing data/forecasts
    
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
