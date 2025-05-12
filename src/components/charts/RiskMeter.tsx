
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface RiskMeterProps {
  riskScore: number; // 1-10
  riskCategory: string;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ riskScore, riskCategory }) => {
  // Convert risk score (1-10) to percentage (0-100)
  const percentage = (riskScore / 10) * 100;
  
  // Determine color based on risk level
  const getColorClass = () => {
    if (riskScore <= 3) return 'bg-green-500';
    if (riskScore <= 7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Risk Assessment</h3>
      <div className="mb-2 flex justify-between text-sm">
        <span>Conservative</span>
        <span>Balanced</span>
        <span>Aggressive</span>
      </div>
      <Progress value={percentage} className="h-2" indicatorClassName={getColorClass()} />
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold">{riskScore}/10</div>
        <div className="text-sm text-gray-600">{riskCategory}</div>
      </div>
    </div>
  );
};

export default RiskMeter;
