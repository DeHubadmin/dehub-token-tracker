
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CombinedTokenData } from '@/services/tokenAPIService';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchHistoricalPriceData } from '@/services/historicalPriceService';

interface PriceChartSectionProps {
  tokenInfo: CombinedTokenData | undefined;
  isLoading: boolean;
}

const PriceChartSection: React.FC<PriceChartSectionProps> = ({
  tokenInfo,
  isLoading
}) => {
  // Fetch 180 days of historical price data
  const { data: historicalData, isLoading: isHistoricalLoading } = useQuery({
    queryKey: ['historicalPriceData', 180],
    queryFn: () => fetchHistoricalPriceData(180),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !isLoading && !!tokenInfo
  });
  
  // Format price for display
  const formatPrice = (value: number) => {
    return `$${value.toFixed(5)}`;
  };
  
  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Process chart data
  const chartData = useMemo(() => {
    if (!historicalData) return [];
    
    return historicalData.prices.map(([timestamp, price]) => ({
      timestamp,
      date: formatDate(timestamp),
      price
    }));
  }, [historicalData]);

  // Define config for the chart
  const chartConfig = {
    price: {
      label: 'Price',
      theme: {
        light: '#FF3B69',
        dark: '#FF3B69'
      }
    }
  };

  const isChartLoading = isLoading || isHistoricalLoading || !historicalData;

  if (isChartLoading) {
    return (
      <div className="mb-8">
        <div className="h-8 w-48 bg-slate-700 rounded animate-pulse mb-4"></div>
        <div className="h-[300px] bg-slate-800 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (!tokenInfo) return null;
  
  // Find min and max price for domain calculation
  const minPrice = Math.min(...chartData.map(item => item.price));
  const maxPrice = Math.max(...chartData.map(item => item.price));
  
  // Add padding to the domain
  const yDomainMin = minPrice * 0.9;
  const yDomainMax = maxPrice * 1.1;

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-400" />
        Price Chart (180 Days)
      </h2>
      
      <div className="p-4 bg-[#0D1B2A] rounded-lg mb-8 w-full">
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
            Last 180 days
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ChartContainer
            config={chartConfig}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
                <XAxis 
                  dataKey="date"
                  tick={{ fill: '#9ca3af' }}
                  axisLine={{ stroke: '#1E3A5F' }}
                  minTickGap={40}
                />
                <YAxis 
                  tickFormatter={formatPrice}
                  tick={{ fill: '#9ca3af' }}
                  axisLine={{ stroke: '#1E3A5F' }}
                  domain={[yDomainMin, yDomainMax]}
                  scale="log"
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
                  stroke="#FF3B69"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: '#FF3B69', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </>
  );
};

export default PriceChartSection;
