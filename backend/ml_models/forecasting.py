
import pandas as pd
import numpy as np
from prophet import Prophet
from datetime import datetime, timedelta
import logging

# Prevent Prophet from printing log messages
logging.getLogger('prophet').setLevel(logging.ERROR)
logging.getLogger('cmdstanpy').disabled = True
logging.getLogger('fbprophet').disabled = True

class FundForecaster:
    def __init__(self):
        """Initialize the forecasting model"""
        self.models = {}
        
    def train_model(self, fund_id, historical_data):
        """Train a Prophet model for a specific fund"""
        # Convert to DataFrame format required by Prophet
        df = pd.DataFrame(historical_data)
        
        # Convert date strings to datetime
        df['ds'] = pd.to_datetime(df['date'])
        df['y'] = df['value']
        
        # Create and train the model
        model = Prophet(
            yearly_seasonality=False,
            weekly_seasonality=False,
            daily_seasonality=False,
            changepoint_prior_scale=0.05
        )
        model.fit(df[['ds', 'y']])
        
        # Store the model
        self.models[fund_id] = model
        
        return model
        
    def predict_future_performance(self, fund_id, historical_data, periods=6):
        """Predict future performance for a fund"""
        # Get or train the model
        if fund_id not in self.models:
            model = self.train_model(fund_id, historical_data)
        else:
            model = self.models[fund_id]
            
        # Create future dataframe for predictions
        future = model.make_future_dataframe(periods=periods, freq='M')
        
        # Make predictions
        forecast = model.predict(future)
        
        # Format predictions
        predictions = []
        for i in range(len(forecast) - periods, len(forecast)):
            date = forecast.iloc[i]['ds']
            predictions.append({
                'date': date.strftime('%Y-%m'),
                'predicted_value': round(forecast.iloc[i]['yhat'], 2),
                'lower_bound': round(forecast.iloc[i]['yhat_lower'], 2),
                'upper_bound': round(forecast.iloc[i]['yhat_upper'], 2)
            })
            
        return predictions
        
    def get_performance_metrics(self, fund_id, historical_data):
        """Get performance metrics for a fund"""
        if not historical_data:
            return {
                'average_return': 0,
                'volatility': 0,
                'sharpe_ratio': 0
            }
            
        # Calculate metrics
        returns = [data['value'] for data in historical_data]
        
        # Calculate metrics only if we have data
        if len(returns) > 1:
            avg_return = sum(returns) / len(returns)
            volatility = np.std(returns)
            risk_free_rate = 0.05  # Assumed risk-free rate
            sharpe_ratio = (avg_return - risk_free_rate) / volatility if volatility > 0 else 0
        else:
            avg_return = returns[0] if returns else 0
            volatility = 0
            sharpe_ratio = 0
            
        return {
            'average_return': round(avg_return, 2),
            'volatility': round(volatility, 2),
            'sharpe_ratio': round(sharpe_ratio, 2)
        }
