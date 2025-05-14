
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler

class FundMatcher:
    def __init__(self, funds_data):
        """Initialize with fund data"""
        self.funds_data = pd.DataFrame(funds_data)
        self._prepare_data()
        self._train_model()
        
    def _prepare_data(self):
        """Prepare fund data for matching algorithm"""
        # Map risk levels to numeric values
        risk_mapping = {
            'Low': 1,
            'Low-Medium': 2,
            'Medium': 3,
            'High': 4, 
            'Very High': 5
        }
        
        # Create features for matching
        self.funds_data['risk_score'] = self.funds_data['risk'].map(risk_mapping)
        
        # Extract relevant features for matching
        self.features = self.funds_data[['performancePercent', 'risk_score', 'fee', 'minimumInvestment']].copy()
        
        # Scale features
        self.scaler = StandardScaler()
        self.scaled_features = self.scaler.fit_transform(self.features)
        
    def _train_model(self):
        """Train the KNN model for fund matching"""
        self.model = NearestNeighbors(n_neighbors=min(5, len(self.funds_data)), algorithm='auto')
        self.model.fit(self.scaled_features)
        
    def match_funds(self, user_profile, risk_category, top_n=3):
        """Match funds based on user profile and risk category"""
        # Map risk categories to numeric scores
        risk_category_mapping = {
            'Conservative': 1,
            'Moderate': 2,
            'Balanced': 3,
            'Growth': 4,
            'Aggressive': 5
        }
        
        risk_score = risk_category_mapping.get(risk_category, 3)  # Default to Balanced
        
        # Determine performance expectation based on risk
        expected_performance = 5 + (risk_score * 2)  # Higher risk = higher expected performance
        
        # Determine fee sensitivity (lower income = more fee sensitive)
        try:
            monthly_income = float(user_profile.get('monthlyIncome', 100000))
            if monthly_income < 50000:
                max_fee = 1.5
            elif monthly_income < 100000:
                max_fee = 2.0
            elif monthly_income < 200000:
                max_fee = 2.5
            else:
                max_fee = 3.0
        except (ValueError, TypeError):
            max_fee = 2.0  # Default
            
        # Determine max investment (based on monthly contribution)
        try:
            monthly_contribution = float(user_profile.get('monthlyContribution', 10000))
            max_investment = monthly_contribution * 12  # Roughly one year of contributions
        except (ValueError, TypeError):
            max_investment = 100000  # Default
            
        # Create a query point
        query_point = np.array([
            expected_performance,  # Expected performance
            risk_score,           # Risk score
            max_fee / 2,          # Target fee (half of max)
            max_investment / 2    # Target investment (half of max)
        ]).reshape(1, -1)
        
        # Scale the query point
        scaled_query = self.scaler.transform(query_point)
        
        # Find nearest neighbors
        distances, indices = self.model.kneighbors(scaled_query)
        
        # Get matched funds
        matched_funds = []
        for idx in indices[0]:
            fund = self.funds_data.iloc[idx].to_dict()
            matched_funds.append(fund)
            
        # Additional filtering
        filtered_funds = [
            fund for fund in matched_funds 
            if fund['fee'] <= max_fee and fund['minimumInvestment'] <= max_investment * 2
        ]
        
        # If filtered list is too small, add back some funds
        if len(filtered_funds) < top_n and len(matched_funds) >= top_n:
            filtered_funds = matched_funds[:top_n]
            
        # Limit to top_n
        return filtered_funds[:top_n]
