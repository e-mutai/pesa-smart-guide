
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FundFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  riskFilter: string;
  setRiskFilter: (risk: string) => void;
  assetClassFilter: string;
  setAssetClassFilter: (assetClass: string) => void;
  resetFilters: () => void;
  uniqueRiskLevels: string[];
  uniqueAssetClasses: string[];
}

const FundFilters: React.FC<FundFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  riskFilter,
  setRiskFilter,
  assetClassFilter,
  setAssetClassFilter,
  resetFilters,
  uniqueRiskLevels,
  uniqueAssetClasses
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search funds by name or company"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              {uniqueRiskLevels.map((risk) => (
                <SelectItem key={risk} value={risk}>{risk}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Asset Class</label>
          <Select value={assetClassFilter} onValueChange={setAssetClassFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Asset Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Asset Classes</SelectItem>
              {uniqueAssetClasses.map((assetClass) => (
                <SelectItem key={assetClass} value={assetClass}>{assetClass}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Button variant="outline" onClick={resetFilters} className="w-full">
            <Filter className="mr-2 h-4 w-4" /> Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FundFilters;
