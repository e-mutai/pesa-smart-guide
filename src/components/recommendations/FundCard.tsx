
import React from 'react';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FundCardProps {
  name: string;
  company: string;
  performancePercent: number;
  risk: string;
  description: string;
  fee: number;
  minimumInvestment: number;
  onClick: () => void;
}

const FundCard: React.FC<FundCardProps> = ({
  name,
  company,
  performancePercent,
  risk,
  description,
  fee,
  minimumInvestment,
  onClick
}) => {
  const isPositive = performancePercent >= 0;
  
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{name}</CardTitle>
            <CardDescription className="text-sm text-gray-500">{company}</CardDescription>
          </div>
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'} font-bold`}>
            {isPositive ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
            <span className="ml-1">{Math.abs(performancePercent).toFixed(2)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Risk Level:</span>
            <span className="font-medium">{risk}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Management Fee:</span>
            <span className="font-medium">{fee.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Minimum Investment:</span>
            <span className="font-medium">KES {minimumInvestment.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Past performance is not indicative of future results.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={onClick} className="bg-finance-primary hover:bg-finance-secondary text-white">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FundCard;
