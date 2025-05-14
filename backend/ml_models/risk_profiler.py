
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
import pickle
import os

class RiskProfiler:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), 'risk_model.pkl')
        self.encoder_path = os.path.join(os.path.dirname(__file__), 'encoders.pkl')
        self.model = None
        self.encoders = {}
        self._load_or_create_model()
    
    def _load_or_create_model(self):
        """Load existing model or create a new one"""
        try:
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            with open(self.encoder_path, 'rb') as f:
                self.encoders = pickle.load(f)
            print("Risk profiling model loaded successfully")
        except (FileNotFoundError, EOFError):
            print("No existing model found, creating new model")
            self._create_sample_model()
            
    def _create_sample_model(self):
        """Create a sample risk profiling model based on synthetic data"""
        # Create synthetic data
        np.random.seed(42)
        n_samples = 1000
        
        # Generate features that would influence risk tolerance
        age = np.random.randint(18, 80, n_samples)
        income_levels = np.random.randint(1, 6, n_samples)  # 1=low to 5=high
        investment_goals = np.random.choice(['retirement', 'education', 'property', 'wealth', 'emergency'], n_samples)
        time_horizons = np.random.choice(['short', 'medium', 'long'], n_samples)
        investment_experience = np.random.choice(['none', 'some', 'experienced'], n_samples)
        
        # Determine risk category based on features
        risk_score = (
            (80 - age) * 0.05 +  # younger = higher risk tolerance
            income_levels * 0.5 +
            np.where(investment_goals == 'wealth', 2, 
                   np.where(investment_goals == 'retirement', 1, 
                          np.where(investment_goals == 'property', 1, 
                                 np.where(investment_goals == 'education', 0, -1)))) +
            np.where(time_horizons == 'long', 2, 
                   np.where(time_horizons == 'medium', 1, 0)) +
            np.where(investment_experience == 'experienced', 2, 
                   np.where(investment_experience == 'some', 1, 0))
        )
        
        # Convert scores to risk categories
        risk_categories = np.where(risk_score < 5, 'Conservative',
                                np.where(risk_score < 7, 'Moderate', 
                                       np.where(risk_score < 9, 'Balanced',
                                              np.where(risk_score < 11, 'Growth', 'Aggressive'))))
        
        # Create DataFrame
        data = pd.DataFrame({
            'age': age,
            'monthly_income': income_levels,
            'investment_goal': investment_goals,
            'time_horizon': time_horizons,
            'investment_experience': investment_experience,
            'risk_category': risk_categories
        })
        
        # Prepare features and target
        X = data.drop('risk_category', axis=1)
        y = data['risk_category']
        
        # Encode categorical features
        categorical_features = ['investment_goal', 'time_horizon', 'investment_experience']
        for feature in categorical_features:
            encoder = LabelEncoder()
            X[feature] = encoder.fit_transform(X[feature])
            self.encoders[feature] = encoder
            
        # Train test split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Create and train the model
        self.model = DecisionTreeClassifier(max_depth=5, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Save the model and encoders
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
        with open(self.encoder_path, 'wb') as f:
            pickle.dump(self.encoders, f)
        
        accuracy = self.model.score(X_test, y_test)
        print(f"Model created with accuracy: {accuracy:.2f}")
        
    def predict_risk_profile(self, data):
        """Predict risk category based on user data"""
        # Convert data to DataFrame
        df = pd.DataFrame([data])
        
        # Map monthly_income to income level (1-5)
        try:
            monthly_income = float(data['monthlyIncome'])
            if monthly_income < 50000:
                income_level = 1
            elif monthly_income < 100000:
                income_level = 2
            elif monthly_income < 200000:
                income_level = 3
            elif monthly_income < 500000:
                income_level = 4
            else:
                income_level = 5
        except (ValueError, TypeError):
            income_level = 2  # Default to medium if parsing fails
            
        df['monthly_income'] = income_level
        
        # Rename columns to match training data
        df = df.rename(columns={
            'monthlyIncome': 'monthly_income',
            'investmentGoal': 'investment_goal',
            'timeHorizon': 'time_horizon',
            'existingInvestments': 'investment_experience'
        })
        
        # Encode categorical features
        for feature, encoder in self.encoders.items():
            if feature in df.columns:
                try:
                    df[feature] = encoder.transform(df[feature])
                except ValueError:
                    # Handle unseen categories by setting a default value
                    df[feature] = 0
        
        # Ensure we have all the required features
        required_features = ['age', 'monthly_income', 'investment_goal', 'time_horizon', 'investment_experience']
        for feature in required_features:
            if feature not in df.columns:
                df[feature] = 0  # Default value if feature is missing
                
        # Convert age to numeric
        try:
            df['age'] = pd.to_numeric(df['age'])
        except ValueError:
            df['age'] = 30  # Default age if parsing fails
            
        # Make prediction
        prediction = self.model.predict(df[required_features])
        return prediction[0]  # Return the predicted risk category
