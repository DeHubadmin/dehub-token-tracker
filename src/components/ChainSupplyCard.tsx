
import React from 'react';
import { Card } from '@/components/ui/card';
import { TokenSupply } from '@/services/tokenService';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChainSupplyCardProps {
  chainSupply: TokenSupply;
  percentage: number;
  className?: string;
}

const ChainSupplyCard: React.FC<ChainSupplyCardProps> = ({ 
  chainSupply, 
  percentage,
  className
}) => {
  return (
    <Card className={cn("dehub-card p-6", className)}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white">{chainSupply.chain}</h3>
        <a 
          href={chainSupply.scannerUrl}
          target="_blank"
          rel="noopener noreferrer" 
          className="text-slate-400 hover:text-indigo-400 inline-flex items-center gap-1"
        >
          <span className="text-xs">View</span>
          <ExternalLink size={14} />
        </a>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-slate-400">Supply</span>
          <span className="text-sm font-medium text-white">{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-2xl font-bold text-white">{chainSupply.formattedTotalSupply}</p>
        <p className="text-xs text-slate-400 mt-1">
          Contract: {chainSupply.tokenAddress.substring(0, 6)}...{chainSupply.tokenAddress.substring(chainSupply.tokenAddress.length - 4)}
        </p>
      </div>
    </Card>
  );
};

export default ChainSupplyCard;
