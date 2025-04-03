
import React from 'react';
import { TokenInfo } from '@/services/tokenService';
import { ExternalLink } from 'lucide-react';

interface TokenHeaderProps {
  tokenInfo: TokenInfo | undefined;
  isLoading: boolean;
}

const TokenHeader: React.FC<TokenHeaderProps> = ({ tokenInfo, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="h-12 bg-slate-700 rounded-md mb-4"></div>
      </div>
    );
  }

  if (!tokenInfo) return null;

  return (
    <div className="w-full mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
            ${tokenInfo.symbol} Token Tracker
          </h1>
          <p className="text-slate-400 mt-1">
            {tokenInfo.name} ({tokenInfo.symbol}) supply metrics across all chains
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tokenInfo.chains.map((chain) => (
            <a 
              key={chain.chain}
              href={chain.scannerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full
                bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {chain.chain} <ExternalLink size={12} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenHeader;
