
import React from 'react';
import { CombinedTokenData } from '@/services/tokenAPIService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface HolderStatsSectionProps {
  tokenInfo: CombinedTokenData | undefined;
  isLoading: boolean;
}

const HolderStatsSection: React.FC<HolderStatsSectionProps> = ({ 
  tokenInfo, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <Users size={20} className="text-indigo-400" />
          <Skeleton className="h-8 w-32" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="bg-dehub-card border-dehub-card-border">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const holderStats = tokenInfo?.holderData?.holderStats;
  
  if (!holderStats) {
    return null;
  }

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <Users size={20} className="text-indigo-400" />
        Holders Statistics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="bg-dehub-card border-dehub-card-border col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Current Holders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{holderStats.formattedHolderCount}</div>
            <p className="text-xs text-white/60 mt-1">Last updated: {new Date(holderStats.lastUpdated).toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <HolderChangeCard 
          title="24h Change" 
          value={holderStats.changes.day.value} 
          formatted={holderStats.changes.day.formatted} 
        />
        
        <HolderChangeCard 
          title="7d Change" 
          value={holderStats.changes.week.value} 
          formatted={holderStats.changes.week.formatted} 
        />
        
        <HolderChangeCard 
          title="30d Change" 
          value={holderStats.changes.month.value} 
          formatted={holderStats.changes.month.formatted} 
        />
        
        <HolderChangeCard 
          title="1y Change" 
          value={holderStats.changes.year.value} 
          formatted={holderStats.changes.year.formatted} 
        />
      </div>
    </>
  );
};

interface HolderChangeCardProps {
  title: string;
  value: number;
  formatted: string;
}

const HolderChangeCard: React.FC<HolderChangeCardProps> = ({ title, value, formatted }) => {
  const isPositive = value >= 0;
  
  return (
    <Card className="bg-dehub-card border-dehub-card-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-white/80">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`flex items-center text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? (
            <TrendingUp size={20} className="mr-2" />
          ) : (
            <TrendingDown size={20} className="mr-2" />
          )}
          <span>{formatted}</span>
        </div>
        <p className="text-xs text-white/60 mt-1">From previous period</p>
      </CardContent>
    </Card>
  );
};

export default HolderStatsSection;
