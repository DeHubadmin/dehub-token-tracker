
import React from 'react';
import { TokenInfo } from '@/services/tokenService';
import MarketDataCard from '../MarketDataCard';
import { DollarSign, Activity, TrendingUp } from 'lucide-react';

interface MarketDataSectionProps {
  tokenInfo: TokenInfo | undefined;
  isLoading: boolean;
}

const MarketDataSection: React.FC<MarketDataSectionProps> = ({ 
  tokenInfo, 
  isLoading 
}) => {
  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <DollarSign size={20} className="text-indigo-400" />
        Market Data
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MarketDataCard
          title="Current Price"
          value={tokenInfo?.formattedPrice || '$0.00000'}
          description="Current token price in USD"
          icon={<DollarSign size={24} />}
          isLoading={isLoading}
        />
        <MarketDataCard
          title="Market Cap"
          value={tokenInfo?.formattedMarketCap || '$0.00'}
          description="Price × Circulating Supply"
          tooltipContent="Calculated by multiplying the current price by the circulating supply"
          icon={<Activity size={24} />}
          isLoading={isLoading}
        />
        <MarketDataCard
          title="24h Volume"
          value={tokenInfo?.formattedTotalVolume || '$0.00'}
          description="Trading volume in the last 24 hours"
          icon={<TrendingUp size={24} />}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default MarketDataSection;
