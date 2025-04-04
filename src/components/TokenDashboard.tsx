
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
import { toast } from 'sonner';

const TokenDashboard: React.FC = () => {
  const { data: tokenInfo, isLoading, error } = useQuery({
    queryKey: ['tokenInfo'],
    queryFn: fetchCombinedTokenData,
    retry: 2,
    retryDelay: 1000,
    staleTime: 60000, // Increase stale time to reduce API calls
    refetchInterval: 60000, // Reduce refetch frequency 
    meta: {
      onError: (err: Error) => {
        console.error("Error fetching token data:", err);
        toast.error("Unable to fetch token data", {
          description: "Please check your network connection and try again.",
          duration: 5000
        });
      }
    }
  });

  const isLoadingOrError = isLoading || error || !tokenInfo;

  return (
    <div className="container px-4 py-8 mt-4 mx-auto max-w-6xl">
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded mb-6">
          <p className="text-sm font-medium">
            Network connection issues detected. Please check your connection and try again.
          </p>
        </div>
      )}
      
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
