
import React from 'react';
import { Card } from '@/components/ui/card';
import { TokenSupply } from '@/services/tokenService';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

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
    <Card className={cn("dehub-card p-6 bg-slate-900 border-slate-800", className)}>
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-white">{chainSupply.chain}</h3>
        <a 
          href={chainSupply.scannerUrl}
          target="_blank"
          rel="noopener noreferrer" 
          className="text-slate-400 hover:text-indigo-400 inline-flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-md"
        >
          <span className="text-sm">View</span>
          <ExternalLink size={14} />
        </a>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-base text-slate-400">Supply</span>
          <span className="text-base font-medium text-white">{percentage.toFixed(1)}%</span>
        </div>
        <Progress 
          value={percentage} 
          className="h-2 bg-slate-700" 
        />
      </div>
      
      <div className="mt-4">
        <p className="text-4xl font-bold text-white mb-2">{chainSupply.formattedTotalSupply}</p>
        <p className="text-sm text-slate-400">
          Contract: {chainSupply.tokenAddress.substring(0, 6)}...{chainSupply.tokenAddress.substring(chainSupply.tokenAddress.length - 4)}
        </p>
      </div>
    </Card>
  );
};

export default ChainSupplyCard;
