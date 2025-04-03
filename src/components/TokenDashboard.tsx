
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
    queryFn: fetchTokenInfo
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Data</h2>
          <p className="text-slate-400">
            There was a problem fetching the token information. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <TokenHeader tokenInfo={tokenInfo} isLoading={isLoading} />

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
          isLoading={isLoading}
        />
        <MarketDataCard
          title="Market Cap"
          value={tokenInfo?.formattedMarketCap || '$0.00'}
          description="Price × Circulating Supply"
          tooltipContent="Calculated by multiplying the current price by the circulating supply"
          icon={<Activity size={24} />}
          isLoading={isLoading}
        />
        <MarketDataCard
          title="24h Volume"
          value={tokenInfo?.formattedTotalVolume || '$0.00'}
          description="Trading volume in the last 24 hours"
          icon={<TrendingUp size={24} />}
          isLoading={isLoading}
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
          isLoading={isLoading}
        />
        <PriceChangeCard
          title="7d Change"
          percentage={tokenInfo?.priceChangePercentage7d || 0}
          timeframe="7 days"
          isLoading={isLoading}
        />
        <PriceChangeCard
          title="30d Change"
          percentage={tokenInfo?.priceChangePercentage30d || 0}
          timeframe="30 days"
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PriceChangeCard
          title="90d Change"
          percentage={tokenInfo?.priceChangePercentage90d || 0}
          timeframe="90 days"
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
        <PriceChangeCard
          title="All Time Change"
          percentage={tokenInfo?.priceChangePercentageAllTime || 0}
          timeframe="all time"
          isLoading={isLoading}
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
          isLoading={isLoading}
        />
        <SupplyMetricCard
          title="Circulating Supply"
          value={tokenInfo?.formattedCirculatingSupply || '0'}
          description="Tokens available in the market"
          icon={<BarChart size={24} />}
          isLoading={isLoading}
        />
        <SupplyMetricCard
          title="Maximum Supply"
          value={tokenInfo?.formattedMaxSupply || '0'}
          description="Maximum possible token supply"
          icon={<Trophy size={24} />}
          isLoading={isLoading}
        />
      </div>

      {/* Chain Breakdown */}
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <ArrowUpCircle size={20} className="text-indigo-400" />
        Chain Breakdown
      </h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="dehub-card p-6 animate-pulse">
              <div className="h-5 bg-slate-700 rounded w-1/3 mb-4"></div>
              <div className="h-2 bg-slate-700 rounded-full w-full mb-6"></div>
              <div className="h-8 bg-slate-700 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tokenInfo?.chains.map((chain) => {
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
          Last updated: {tokenInfo?.lastUpdated ? new Date(tokenInfo.lastUpdated).toLocaleString() : 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default TokenDashboard;
