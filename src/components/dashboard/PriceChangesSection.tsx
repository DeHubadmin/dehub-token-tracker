
import React from 'react';
import { TokenInfo } from '@/services/tokenService';
import PriceChangeCard from '../PriceChangeCard';
import { TrendingUp, Clock1, History, Trophy, Target } from 'lucide-react';

interface PriceChangesSectionProps {
  tokenInfo: TokenInfo | undefined;
  isLoading: boolean;
}

const PriceChangesSection: React.FC<PriceChangesSectionProps> = ({ 
  tokenInfo, 
  isLoading 
}) => {
  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <TrendingUp size={20} className="text-indigo-400" />
        Price Changes
      </h2>
      
      {/* Short-term changes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PriceChangeCard
          title="1h Change"
          percentage={tokenInfo?.priceChangePercentage1h || 0}
          timeframe="1 hour"
          isLoading={isLoading}
          icon={<Clock1 size={20} />}
        />
        <PriceChangeCard
          title="24h Change"
          percentage={tokenInfo?.priceChangePercentage24h || 0}
          value={tokenInfo?.priceChange24h || 0}
          timeframe="24 hours"
          isLoading={isLoading}
        />
        <PriceChangeCard
          title="7d Change"
          percentage={tokenInfo?.priceChangePercentage7d || 0}
          timeframe="7 days"
          isLoading={isLoading}
        />
      </div>
      
      {/* Medium-term changes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PriceChangeCard
          title="14d Change"
          percentage={tokenInfo?.priceChangePercentage14d || 0}
          timeframe="14 days"
          isLoading={isLoading}
          className="h-full"
        />
        <PriceChangeCard
          title="30d Change"
          percentage={tokenInfo?.priceChangePercentage30d || 0}
          timeframe="30 days"
          isLoading={isLoading}
          className="h-full"
        />
        <PriceChangeCard
          title="1y Change"
          percentage={tokenInfo?.priceChangePercentage1y || 0}
          timeframe="1 year"
          isLoading={isLoading}
          className="h-full"
        />
      </div>
      
      {/* Long-term changes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PriceChangeCard
          title="From All Time Low"
          percentage={tokenInfo?.priceChangePercentageAllTime || 0}
          timeframe="all time"
          isLoading={isLoading}
          className="h-full"
          icon={<History size={20} />}
        />
        <PriceChangeCard
          title="From All Time High"
          percentage={tokenInfo?.priceChangePercentageFromATH || 0}
          timeframe={`ATH: ${tokenInfo?.formattedAllTimeHigh || '$0.00000'}`}
          isLoading={isLoading}
          className="h-full"
          icon={<Trophy size={20} />}
        />
      </div>

      {/* Multiples to ATH */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <PriceChangeCard
          title="Multiples to ATH"
          percentage={0}
          value={tokenInfo?.multiplesToATH || 0}
          timeframe={`ATH: ${tokenInfo?.formattedAllTimeHigh || '$0.00000'}`}
          isLoading={isLoading}
          className="h-full"
          icon={<Target size={20} />}
          isMultiple={true}
        />
      </div>
    </>
  );
};

export default PriceChangesSection;
