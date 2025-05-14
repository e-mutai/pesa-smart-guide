
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-finance-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <p className="mt-4 text-gray-600">Loading funds...</p>
    </div>
  );
};

export default LoadingState;
