
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  date: string;
  value: number;
  benchmark?: number;
}

interface PerformanceChartProps {
  data: DataPoint[];
  title: string;
  fundName: string;
  benchmarkName?: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, title, fundName, benchmarkName }) => {
  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            padding={{ left: 30, right: 30 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, '']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name={fundName}
            stroke="#0A2647"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          {benchmarkName && (
            <Line
              type="monotone"
              dataKey="benchmark"
              name={benchmarkName}
              stroke="#64748b"
              strokeWidth={2}
              strokeDasharray="3 3"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
