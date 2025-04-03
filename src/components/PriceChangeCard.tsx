
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PriceChangeCardProps {
  title: string;
  percentage: number;
  value?: number;
  timeframe?: string;
  className?: string;
  isLoading?: boolean;
}

const PriceChangeCard: React.FC<PriceChangeCardProps> = ({
  title,
  percentage,
  value,
  timeframe,
  className,
  isLoading = false
}) => {
  const isPositive = percentage >= 0;
  const displayValue = value !== undefined ? value.toFixed(8) : undefined;
  
  if (isLoading) {
    return (
      <Card className={cn("dehub-card p-6", className)}>
        <div className="animate-pulse">
          <div className="h-5 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-slate-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("dehub-card p-6", className)}>
      <h3 className="text-sm font-medium text-slate-400 mb-1">{title}</h3>
      
      <div className={cn(
        "flex items-center text-2xl font-bold mb-1",
        isPositive ? "text-green-500" : "text-red-500"
      )}>
        {isPositive ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
        <span>{Math.abs(percentage).toFixed(2)}%</span>
      </div>
      
      {displayValue && (
        <p className={cn(
          "text-base",
          isPositive ? "text-green-400" : "text-red-400"
        )}>
          {isPositive ? "+" : ""}{displayValue}
        </p>
      )}
      
      {timeframe && (
        <p className="text-xs text-slate-400 mt-1">
          Over the last {timeframe}
        </p>
      )}
    </Card>
  );
};

export default PriceChangeCard;
