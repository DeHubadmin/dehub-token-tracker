
import React from 'react';
import { CombinedTokenData } from '@/services/tokenAPIService';
import { Users, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import MarketDataCard from '../MarketDataCard';

interface HolderStatsSectionProps {
  tokenInfo: CombinedTokenData | undefined;
  isLoading: boolean;
}

const HolderStatsSection: React.FC<HolderStatsSectionProps> = ({
  tokenInfo,
  isLoading
}) => {
  // Always show loading state if data is loading or if holderStats is undefined
  if (isLoading || !tokenInfo?.holderData?.holderStats) {
    return <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2 my-[30px] py-0">
          <Users size={20} className="text-indigo-400" />
          <span className="mx-0 py-[10px] my-[10px]">Holders Statistics</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => <MarketDataCard key={index} title="" value="" isLoading={true} className="dehub-glow" />)}
        </div>
      </div>;
  }
  
  const holderStats = tokenInfo.holderData.holderStats;
  const isDailyUpdate = tokenInfo.holderData.dailyUpdate === true;

  // Determine color classes based on value for each card
  const getDayChangeColorClass = () => holderStats.changes.day.value >= 0 ? "text-green-500" : "text-red-500";
  const getWeekChangeColorClass = () => holderStats.changes.week.value >= 0 ? "text-green-500" : "text-red-500";
  const getMonthChangeColorClass = () => holderStats.changes.month.value >= 0 ? "text-green-500" : "text-red-500";
  const getYearChangeColorClass = () => holderStats.changes.year.value >= 0 ? "text-green-500" : "text-red-500";
  
  // Format the last updated time
  const lastUpdated = new Date(holderStats.lastUpdated).toLocaleString();
  
  return <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2 my-[40px] py-0">
        <Users size={20} className="text-indigo-400" />
        Holders Statistics
        {isDailyUpdate && (
          <span className="text-xs font-normal bg-indigo-500/20 px-2 py-1 rounded-full flex items-center gap-1">
            <RefreshCw size={12} className="text-indigo-400" />
            Updated daily
          </span>
        )}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MarketDataCard 
          title="Current Holders" 
          value={holderStats.formattedHolderCount} 
          description={`Last updated: ${lastUpdated}`} 
          icon={<Users size={24} className="text-indigo-400" />} 
          className="dehub-glow" 
        />
        
        <MarketDataCard 
          title="24h Change" 
          value={holderStats.changes.day.formatted} 
          description="From previous period" 
          icon={holderStats.changes.day.value >= 0 ? <TrendingUp size={24} className="text-green-500" /> : <TrendingDown size={24} className="text-red-500" />} 
          className={getDayChangeColorClass() + " dehub-glow"} 
        />
        
        <MarketDataCard 
          title="7d Change" 
          value={holderStats.changes.week.formatted} 
          description="From previous period" 
          icon={holderStats.changes.week.value >= 0 ? <TrendingUp size={24} className="text-green-500" /> : <TrendingDown size={24} className="text-red-500" />} 
          className={getWeekChangeColorClass() + " dehub-glow"} 
        />
        
        <MarketDataCard 
          title="30d Change" 
          value={holderStats.changes.month.formatted} 
          description="From previous period" 
          icon={holderStats.changes.month.value >= 0 ? <TrendingUp size={24} className="text-green-500" /> : <TrendingDown size={24} className="text-red-500" />} 
          className={getMonthChangeColorClass() + " dehub-glow"} 
        />
        
        <MarketDataCard 
          title="1y Change" 
          value={holderStats.changes.year.formatted} 
          description="From previous period" 
          icon={holderStats.changes.year.value >= 0 ? <TrendingUp size={24} className="text-green-500" /> : <TrendingDown size={24} className="text-red-500" />} 
          className={getYearChangeColorClass() + " dehub-glow"} 
        />
      </div>
    </>;
};

export default HolderStatsSection;
