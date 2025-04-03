
import React from 'react';
import { TokenInfo } from '@/services/tokenService';
import ChainSupplyCard from '../ChainSupplyCard';
import { ArrowUpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ChainBreakdownSectionProps {
  tokenInfo: TokenInfo | undefined;
  isLoading: boolean;
}

const ChainBreakdownSection: React.FC<ChainBreakdownSectionProps> = ({ 
  tokenInfo, 
  isLoading 
}) => {
  const hasNoChains = !isLoading && (!tokenInfo?.chains || tokenInfo.chains.length === 0);

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <ArrowUpCircle size={20} className="text-indigo-400" />
        Chain Breakdown
      </h2>
      
      {isLoading || !tokenInfo?.chains ? (
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
          {hasNoChains && (
            <div className="col-span-2 text-center py-8">
              <p className="text-slate-400">No chain data available</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChainBreakdownSection;
