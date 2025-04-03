
import React from 'react';
import { TokenInfo } from '@/services/tokenService';
import SupplyMetricCard from '../SupplyMetricCard';
import { Coins, BarChart, Trophy } from 'lucide-react';

interface SupplyMetricsSectionProps {
  tokenInfo: TokenInfo | undefined;
  isLoading: boolean;
}

const SupplyMetricsSection: React.FC<SupplyMetricsSectionProps> = ({ 
  tokenInfo, 
  isLoading 
}) => {
  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <Coins size={20} className="text-indigo-400" />
        Supply Metrics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SupplyMetricCard
          title="Total Supply (All Chains)"
          value={tokenInfo?.formattedTotalSupplyAcrossChains || '0'}
          description="Total tokens across all supported chains"
          icon={<Coins size={24} />}
          isLoading={isLoading}
        />
        <SupplyMetricCard
          title="Circulating Supply"
          value={tokenInfo?.formattedCirculatingSupply || '0'}
          description="Tokens available in the market"
          icon={<BarChart size={24} />}
          isLoading={isLoading}
        />
        <SupplyMetricCard
          title="Maximum Supply"
          value={tokenInfo?.formattedMaxSupply || '0'}
          description="Maximum possible token supply"
          icon={<Trophy size={24} />}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default SupplyMetricsSection;
