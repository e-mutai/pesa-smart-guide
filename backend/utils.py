
from datetime import datetime, timedelta
import random

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
