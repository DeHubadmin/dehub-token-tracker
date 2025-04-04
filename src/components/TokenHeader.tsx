
import React from 'react';
import { CombinedTokenData } from '@/services/tokenAPIService';
import { ExternalLink, Clock } from 'lucide-react';
interface TokenHeaderProps {
  tokenInfo: CombinedTokenData | undefined;
  isLoading: boolean;
}
const TokenHeader: React.FC<TokenHeaderProps> = ({
  tokenInfo,
  isLoading
}) => {
  if (isLoading) {
    return <div className="w-full animate-pulse">
        <div className="h-12 bg-slate-700 rounded-md mb-4"></div>
      </div>;
  }
  if (!tokenInfo) return null;

  // Format the last updated time
  const lastUpdated = tokenInfo.marketData.lastUpdated ? new Date(tokenInfo.marketData.lastUpdated).toLocaleString() : 'Unknown';
  return <div className="w-full mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              ${tokenInfo.symbol} Metrics
            </h1>
          </div>
          <p className="text-slate-400 mt-1">
            {tokenInfo.name} ({tokenInfo.symbol}) metrics across all chains
          </p>
          <div className="flex items-center text-xs text-slate-500 mt-1">
            <Clock size={12} className="mr-1" />
            Last updated: {lastUpdated}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tokenInfo.chainBreakdown.chains.map(chain => <a key={chain.name} href={chain.scannerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full
                bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors">
              {chain.name} <ExternalLink size={12} />
            </a>)}
        </div>
      </div>
    </div>;
};
export default TokenHeader;
