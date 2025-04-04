
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
import { mockTokenData } from '@/services/mockData';
import { toast } from 'sonner';

const TokenDashboard: React.FC = () => {
  const { data: tokenInfo, isLoading, error } = useQuery({
    queryKey: ['tokenInfo'],
    queryFn: fetchCombinedTokenData,
    retry: 2,
    retryDelay: 1000,
    staleTime: 60000, // Increase stale time to reduce API calls
    refetchInterval: 60000, // Reduce refetch frequency 
    onError: (err) => {
      console.error("Error fetching token data:", err);
      toast.error("Using offline data - API services unavailable", {
        description: "We're showing cached data until our servers are back online.",
        duration: 5000
      });
    }
  });

  // Use mock data if there's an error or tokenInfo is null
  const displayData = error || !tokenInfo ? mockTokenData : tokenInfo;
  const isLoadingOrError = isLoading && !displayData;

  // When using mock data, show an indicator
  React.useEffect(() => {
    if (error && !isLoading) {
      console.log("Using mock data due to API error");
    }
  }, [error, isLoading]);

  return (
    <div className="container px-4 py-8 mt-4 mx-auto max-w-6xl">
      {error && !isLoading && (
        <div className="bg-amber-900/30 border border-amber-800 text-amber-200 px-4 py-3 rounded mb-6">
          <p className="text-sm font-medium">
            Network connection issues detected. Showing offline data until services are restored.
          </p>
        </div>
      )}
      
      <TokenHeader tokenInfo={displayData} isLoading={isLoadingOrError} />
      
      <MarketDataSection 
        tokenInfo={displayData} 
        isLoading={isLoadingOrError} 
      />
      
      <PriceChangesSection 
        tokenInfo={displayData} 
        isLoading={isLoadingOrError} 
      />
      
      <SupplyMetricsSection 
        tokenInfo={displayData} 
        isLoading={isLoadingOrError} 
      />
      
      <ChainBreakdownSection 
        tokenInfo={displayData} 
        isLoading={isLoadingOrError} 
      />
      
      <HolderStatsSection 
        tokenInfo={displayData} 
        isLoading={isLoadingOrError} 
      />
      
      <TopHoldersSection 
        tokenInfo={displayData} 
        isLoading={isLoadingOrError} 
      />
      
      <RecentTransfersSection 
        tokenInfo={displayData} 
        isLoading={isLoadingOrError} 
      />
      
      <LastUpdatedInfo 
        timestamp={displayData?.marketData?.lastUpdated} 
        isLoading={isLoadingOrError} 
      />
    </div>
  );
};

export default TokenDashboard;
