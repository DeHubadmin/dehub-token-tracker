
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTokenInfo } from '@/services/tokenService';
import TokenHeader from './TokenHeader';
import MarketDataSection from './dashboard/MarketDataSection';
import PriceChangesSection from './dashboard/PriceChangesSection';
import SupplyMetricsSection from './dashboard/SupplyMetricsSection';
import ChainBreakdownSection from './dashboard/ChainBreakdownSection';
import LastUpdatedInfo from './dashboard/LastUpdatedInfo';

const TokenDashboard: React.FC = () => {
  const { data: tokenInfo, isLoading, error } = useQuery({
    queryKey: ['tokenInfo'],
    queryFn: fetchTokenInfo,
    retry: 2,
    retryDelay: 1000
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
      
      <LastUpdatedInfo 
        timestamp={tokenInfo?.lastUpdated} 
        isLoading={isLoadingOrError} 
      />
    </div>
  );
};

export default TokenDashboard;
