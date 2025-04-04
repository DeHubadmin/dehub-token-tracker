
import React from 'react';
import { CombinedTokenData } from '@/services/tokenAPIService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';
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
  if (isLoading) {
    return <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <Users size={20} className="text-indigo-400" />
          <Skeleton className="h-8 w-32" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => <MarketDataCard key={index} title="" value="" isLoading={true} />)}
        </div>
      </div>;
  }
  const holderStats = tokenInfo?.holderData?.holderStats;
  if (!holderStats) {
    return null;
  }
  return <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2 my-[40px] py-0">
        <Users size={20} className="text-indigo-400" />
        Holders Statistics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MarketDataCard 
          title="Current Holders" 
          value={holderStats.formattedHolderCount} 
          description={`Last updated: ${new Date(holderStats.lastUpdated).toLocaleString()}`} 
          icon={<Users size={24} className="text-indigo-400" />}
          className="dehub-glow"
        />
        
        <MarketDataCard 
          title="24h Change" 
          value={holderStats.changes.day.formatted} 
          description="From previous period" 
          icon={holderStats.changes.day.value >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />} 
          className={holderStats.changes.day.value >= 0 ? "text-green-500 dehub-glow" : "text-red-500 dehub-glow"} 
        />
        
        <MarketDataCard 
          title="7d Change" 
          value={holderStats.changes.week.formatted} 
          description="From previous period" 
          icon={holderStats.changes.week.value >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />} 
          className={holderStats.changes.week.value >= 0 ? "text-green-500 dehub-glow" : "text-red-500 dehub-glow"} 
        />
        
        <MarketDataCard 
          title="30d Change" 
          value={holderStats.changes.month.formatted} 
          description="From previous period" 
          icon={holderStats.changes.month.value >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />} 
          className={holderStats.changes.month.value >= 0 ? "text-green-500 dehub-glow" : "text-red-500 dehub-glow"} 
        />
        
        <MarketDataCard 
          title="1y Change" 
          value={holderStats.changes.year.formatted} 
          description="From previous period" 
          icon={holderStats.changes.year.value >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />} 
          className={holderStats.changes.year.value >= 0 ? "text-green-500 dehub-glow" : "text-red-500 dehub-glow"} 
        />
      </div>
    </>;
};
export default HolderStatsSection;
