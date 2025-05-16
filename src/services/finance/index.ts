
// Export all financial services
export * from './types';
export * from './constants';
export * from './alphaVantageService';
export * from './fundService';

// Export a combined service for backward compatibility
import { alphaVantageService } from './alphaVantageService';
import { fundService } from './fundService';

export const realDataService = {
  ...alphaVantageService,
  ...fundService,
};

export default realDataService;
