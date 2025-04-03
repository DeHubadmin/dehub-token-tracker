
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PriceChangeCardProps {
  title: string;
  percentage: number;
  value?: number;
  timeframe?: string;
  className?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const PriceChangeCard: React.FC<PriceChangeCardProps> = ({
  title,
  percentage,
  value,
  timeframe,
  className,
  isLoading = false,
  icon
}) => {
  const isPositive = percentage >= 0;
  const displayValue = value !== undefined ? value.toFixed(8) : undefined;
  
  if (isLoading) {
    return (
      <Card className={cn("dehub-card p-6", className)}>
        <div className="space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-8 w-1/2" />
          {value !== undefined && <Skeleton className="h-4 w-1/4" />}
          {timeframe && <Skeleton className="h-4 w-2/5" />}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("dehub-card p-6", className)}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-slate-400 mb-1">{title}</h3>
        {icon && <div className="text-indigo-400">{icon}</div>}
      </div>
      
      <div className={cn(
        "flex items-center text-2xl font-bold mb-1",
        isPositive ? "text-green-500" : "text-red-500"
      )}>
        {isPositive ? <ArrowUpRight size={24} className="text-green-500" /> : <ArrowDownRight size={24} className="text-red-500" />}
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
          {timeframe.startsWith('ATH:') ? timeframe : `Over the last ${timeframe}`}
        </p>
      )}
    </Card>
  );
};

export default PriceChangeCard;
