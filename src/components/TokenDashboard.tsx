
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCombinedTokenData, CombinedTokenData } from '@/services/tokenAPIService';
import TokenHeader from './TokenHeader';
import MarketDataSection from './dashboard/MarketDataSection';
import PriceChangesSection from './dashboard/PriceChangesSection';
import SupplyMetricsSection from './dashboard/SupplyMetricsSection';
import ChainBreakdownSection from './dashboard/ChainBreakdownSection';
import HolderStatsSection from './dashboard/HolderStatsSection';
import TopHoldersSection from './dashboard/TopHoldersSection';
import RecentTransfersSection from './dashboard/RecentTransfersSection';
import LastUpdatedInfo from './dashboard/LastUpdatedInfo';

const TokenDashboard: React.FC = () => {
  const { data: tokenInfo, isLoading, error } = useQuery({
    queryKey: ['tokenInfo'],
    queryFn: fetchCombinedTokenData,
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000, // Reduce stale time to 30 seconds to fetch fresh data more often
    refetchInterval: 60000 // Refetch every minute to ensure data is updated regularly
  });

  // If there's an error or tokenInfo is null, we show loading state
  const isLoadingOrError = isLoading || error !== null || !tokenInfo;

  return (
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <TokenHeader tokenInfo={tokenInfo} isLoading={isLoadingOrError} />
      
      <MarketDataSection 
        tokenInfo={tokenInfo} 
        isLoading={isLoadingOrError} 
      />
      
      <PriceChangesSection 
        tokenInfo={tokenInfo} 
        isLoading={isLoadingOrError} 
      />
      
      <SupplyMetricsSection 
        tokenInfo={tokenInfo} 
        isLoading={isLoadingOrError} 
      />
      
      <ChainBreakdownSection 
        tokenInfo={tokenInfo} 
        isLoading={isLoadingOrError} 
      />
      
      <HolderStatsSection 
        tokenInfo={tokenInfo} 
        isLoading={isLoadingOrError} 
      />
      
      <TopHoldersSection 
        tokenInfo={tokenInfo} 
        isLoading={isLoadingOrError} 
      />
      
      <RecentTransfersSection 
        tokenInfo={tokenInfo} 
        isLoading={isLoadingOrError} 
      />
      
      <LastUpdatedInfo 
        timestamp={tokenInfo?.marketData?.lastUpdated} 
        isLoading={isLoadingOrError} 
      />
    </div>
  );
};

export default TokenDashboard;
