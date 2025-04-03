
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTokenInfo } from '@/services/tokenService';
import TokenHeader from './TokenHeader';
import SupplyMetricCard from './SupplyMetricCard';
import ChainSupplyCard from './ChainSupplyCard';
import MarketDataCard from './MarketDataCard';
import PriceChangeCard from './PriceChangeCard';
import { Coins, Trophy, BarChart, ArrowUpCircle, DollarSign, TrendingUp, Activity, Clock, History } from 'lucide-react';

const TokenDashboard: React.FC = () => {
  const { data: tokenInfo, isLoading, error } = useQuery({
    queryKey: ['tokenInfo'],
    queryFn: fetchTokenInfo,
    retry: 2,
    retryDelay: 1000
  });

  // If there's an error or tokenInfo is null, we show loading state
  const isLoadingOrError = isLoading || error || !tokenInfo;

  return (
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <TokenHeader tokenInfo={tokenInfo} isLoading={isLoadingOrError} />

      {/* Market Metrics */}
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <DollarSign size={20} className="text-indigo-400" />
        Market Data
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MarketDataCard
          title="Current Price"
          value={tokenInfo?.formattedPrice || '$0.00'}
          description="Current token price in USD"
          icon={<DollarSign size={24} />}
          isLoading={isLoadingOrError}
        />
        <MarketDataCard
          title="Market Cap"
          value={tokenInfo?.formattedMarketCap || '$0.00'}
          description="Price × Circulating Supply"
          tooltipContent="Calculated by multiplying the current price by the circulating supply"
          icon={<Activity size={24} />}
          isLoading={isLoadingOrError}
        />
        <MarketDataCard
          title="24h Volume"
          value={tokenInfo?.formattedTotalVolume || '$0.00'}
          description="Trading volume in the last 24 hours"
          icon={<TrendingUp size={24} />}
          isLoading={isLoadingOrError}
        />
      </div>

      {/* Price Changes */}
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <TrendingUp size={20} className="text-indigo-400" />
        Price Changes
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PriceChangeCard
          title="24h Change"
          percentage={tokenInfo?.priceChangePercentage24h || 0}
          value={tokenInfo?.priceChange24h || 0}
          timeframe="24 hours"
          isLoading={isLoadingOrError}
        />
        <PriceChangeCard
          title="7d Change"
          percentage={tokenInfo?.priceChangePercentage7d || 0}
          timeframe="7 days"
          isLoading={isLoadingOrError}
        />
        <PriceChangeCard
          title="30d Change"
          percentage={tokenInfo?.priceChangePercentage30d || 0}
          timeframe="30 days"
          isLoading={isLoadingOrError}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PriceChangeCard
          title="90d Change"
          percentage={tokenInfo?.priceChangePercentage90d || 0}
          timeframe="90 days"
          isLoading={isLoadingOrError}
          className="h-full"
        />
        <PriceChangeCard
          title="1y Change"
          percentage={tokenInfo?.priceChangePercentage1y || 0}
          timeframe="1 year"
          isLoading={isLoadingOrError}
          className="h-full"
        />
        <PriceChangeCard
          title="All Time Change"
          percentage={tokenInfo?.priceChangePercentageAllTime || 0}
          timeframe="all time"
          isLoading={isLoadingOrError}
          className="h-full"
          icon={<History size={20} />}
        />
      </div>

      {/* Supply Metrics */}
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <Coins size={20} className="text-indigo-400" />
        Supply Metrics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SupplyMetricCard
          title="Total Supply (All Chains)"
          value={tokenInfo?.formattedTotalSupplyAcrossChains || '0'}
          description="Total tokens across all supported chains"
          icon={<Coins size={24} />}
          isLoading={isLoadingOrError}
        />
        <SupplyMetricCard
          title="Circulating Supply"
          value={tokenInfo?.formattedCirculatingSupply || '0'}
          description="Tokens available in the market"
          icon={<BarChart size={24} />}
          isLoading={isLoadingOrError}
        />
        <SupplyMetricCard
          title="Maximum Supply"
          value={tokenInfo?.formattedMaxSupply || '0'}
          description="Maximum possible token supply"
          icon={<Trophy size={24} />}
          isLoading={isLoadingOrError}
        />
      </div>

      {/* Chain Breakdown */}
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <ArrowUpCircle size={20} className="text-indigo-400" />
        Chain Breakdown
      </h2>
      
      {isLoadingOrError || !tokenInfo?.chains ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="dehub-card p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tokenInfo.chains.map((chain) => {
            const percentage = (chain.totalSupply / (tokenInfo?.totalSupplyAcrossChains || 1)) * 100;
            return (
              <ChainSupplyCard 
                key={chain.chain} 
                chainSupply={chain} 
                percentage={percentage} 
              />
            );
          })}
        </div>
      )}
      
      {/* Last Updated */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-400 flex items-center justify-center gap-1">
          <Clock size={14} className="text-slate-500" />
          Last updated: {isLoadingOrError ? 'Loading...' : (tokenInfo?.lastUpdated ? new Date(tokenInfo.lastUpdated).toLocaleString() : 'Unknown')}
        </p>
      </div>
    </div>
  );
};

export default TokenDashboard;
