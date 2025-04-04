
import React from 'react';
import { CombinedTokenData } from '@/services/tokenAPIService';
import PriceChangeCard from '../PriceChangeCard';
import { TrendingUp, Clock1, History, Trophy, Target } from 'lucide-react';

interface PriceChangesSectionProps {
  tokenInfo: CombinedTokenData | undefined;
  isLoading: boolean;
}

const PriceChangesSection: React.FC<PriceChangesSectionProps> = ({
  tokenInfo,
  isLoading
}) => {
  // Calculate ATH timeframe text with the actual ATH value
  const athTimeframe = tokenInfo?.marketData?.allTimeHigh 
    ? `ATH: $${tokenInfo.marketData.allTimeHigh.toFixed(6)}` 
    : 'ATH: Loading...';
  
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
          percentage={tokenInfo?.marketData?.priceChangePercentage1h || 0}
          timeframe="1 hour" 
          isLoading={isLoading} 
          icon={<Clock1 size={20} />} 
        />
        <PriceChangeCard 
          title="24h Change" 
          percentage={tokenInfo?.marketData?.priceChangePercentage24h || 0} 
          timeframe="24 hours" 
          isLoading={isLoading} 
        />
        <PriceChangeCard 
          title="7d Change" 
          percentage={tokenInfo?.marketData?.priceChangePercentage7d || 0} 
          timeframe="7 days" 
          isLoading={isLoading} 
        />
      </div>
      
      {/* Medium-term changes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PriceChangeCard 
          title="14d Change" 
          percentage={tokenInfo?.marketData?.priceChangePercentage14d || 0}
          timeframe="14 days" 
          isLoading={isLoading} 
          className="h-full" 
        />
        <PriceChangeCard 
          title="30d Change" 
          percentage={tokenInfo?.marketData?.priceChangePercentage30d || 0}
          timeframe="30 days" 
          isLoading={isLoading} 
          className="h-full" 
        />
        <PriceChangeCard 
          title="1y Change" 
          percentage={tokenInfo?.marketData?.priceChangePercentage1y || 0}
          timeframe="1 year" 
          isLoading={isLoading} 
          className="h-full" 
        />
      </div>
      
      {/* Long-term changes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PriceChangeCard 
          title="From All Time Low" 
          percentage={tokenInfo?.marketData?.priceChangePercentageAllTime || 0}
          timeframe="all time" 
          isLoading={isLoading} 
          className="h-full" 
          icon={<History size={20} />} 
        />
        <PriceChangeCard 
          title="From All Time High" 
          percentage={tokenInfo?.marketData?.priceChangePercentageFromATH || 0}
          timeframe={athTimeframe}
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
          value={tokenInfo?.marketData?.multiplesToATH || 0}
          timeframe={athTimeframe}
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
