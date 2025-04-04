
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CombinedTokenData } from '@/services/tokenAPIService';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';

interface PriceChartSectionProps {
  tokenInfo: CombinedTokenData | undefined;
  isLoading: boolean;
}

// Define the price data structure
interface PriceDataPoint {
  name: string;
  price: number;
  timestamp: Date;
}

const PriceChartSection: React.FC<PriceChartSectionProps> = ({
  tokenInfo,
  isLoading
}) => {
  // Format price for display
  const formatPrice = (value: number) => {
    return `$${value.toFixed(5)}`;
  };
  
  // Generate price data from the actual token information
  const priceData = useMemo(() => {
    if (!tokenInfo) return [];
    
    // We'll create a simple dataset using the available price metrics
    // In a real implementation, you would fetch historical price data from an API
    const currentPrice = tokenInfo.marketData.price;
    
    // Calculate prices based on percentage changes
    const calculate = (percentage: number) => {
      // Calculate the price in the past based on the percentage change
      // For example, if current price is $1 and 7d change is -10%, then price 7 days ago was $1.11...
      return currentPrice / (1 + (percentage / 100));
    };
    
    const today = new Date();
    
    return [
      // Generate data points based on actual percentage changes
      {
        name: '30d',
        price: calculate(tokenInfo.marketData.priceChangePercentage30d),
        timestamp: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        name: '14d',
        price: calculate(tokenInfo.marketData.priceChangePercentage14d),
        timestamp: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        name: '7d',
        price: calculate(tokenInfo.marketData.priceChangePercentage7d),
        timestamp: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        name: '1d',
        price: calculate(tokenInfo.marketData.priceChangePercentage24h),
        timestamp: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'Now',
        price: currentPrice,
        timestamp: today
      },
    ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()); // Sort by timestamp
  }, [tokenInfo]);
  
  // Define config for the chart
  const chartConfig = {
    price: {
      label: 'Price',
      theme: {
        light: '#33C3F0',
        dark: '#33C3F0'
      }
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="h-8 w-48 bg-slate-700 rounded animate-pulse mb-4"></div>
        <div className="h-[300px] bg-slate-800 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (!tokenInfo) return null;

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-400" />
        Price Chart
      </h2>
      
      <div className="p-4 bg-slate-800 rounded-lg mb-8">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-white">
              {tokenInfo.marketData.formattedPrice}
            </span>
            <span className={`ml-2 text-sm ${tokenInfo.marketData.priceChangePercentage24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {tokenInfo.marketData.priceChangePercentage24h >= 0 ? '+' : ''}
              {tokenInfo.marketData.priceChangePercentage24h.toFixed(2)}%
            </span>
          </div>
          <div className="text-sm text-slate-400">
            Last 30 days
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ChartContainer
            config={chartConfig}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={priceData}
                margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name"
                  tick={{ fill: '#9ca3af' }}
                  axisLine={{ stroke: '#4b5563' }}
                />
                <YAxis 
                  tickFormatter={formatPrice}
                  tick={{ fill: '#9ca3af' }}
                  axisLine={{ stroke: '#4b5563' }}
                  domain={['auto', 'auto']}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => `${label}`}
                      formatter={(value: any) => [`$${Number(value).toFixed(5)}`, 'Price']}
                      labelClassName="text-slate-300"
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#33C3F0"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#33C3F0', stroke: '#33C3F0', strokeWidth: 1 }}
                  activeDot={{ r: 5, fill: '#33C3F0', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="text-xs text-slate-500 mt-2 text-center">
          Note: This chart shows approximate data calculated from percentage changes. For more accurate data, a historical price API would be needed.
        </div>
      </div>
    </>
  );
};

export default PriceChartSection;
