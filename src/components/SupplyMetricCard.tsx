
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SupplyMetricCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const SupplyMetricCard: React.FC<SupplyMetricCardProps> = ({
  title,
  value,
  description,
  icon,
  className,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card className={cn("dehub-card p-6", className)}>
        <div className="animate-pulse">
          <div className="h-5 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-slate-700 rounded w-2/3 mb-2"></div>
          {description && <div className="h-4 bg-slate-700 rounded w-1/2"></div>}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("dehub-card p-6 dehub-glow", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">{title}</h3>
          <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
          {description && (
            <p className="text-xs text-slate-400 mt-1">{description}</p>
          )}
        </div>
        {icon && <div className="text-indigo-400">{icon}</div>}
      </div>
    </Card>
  );
};

export default SupplyMetricCard;
