
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CombinedTokenData } from '@/services/tokenAPIService';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';

interface PriceChartSectionProps {
  tokenInfo: CombinedTokenData | undefined;
  isLoading: boolean;
}

// Mock data for the chart - in a real app, you would fetch this from an API
const mockPriceData = [
  { name: 'Jan', price: 0.00281 },
  { name: 'Feb', price: 0.00345 },
  { name: 'Mar', price: 0.00421 },
  { name: 'Apr', price: 0.00389 },
  { name: 'May', price: 0.00412 },
  { name: 'Jun', price: 0.00437 },
  { name: 'Jul', price: 0.00498 },
  { name: 'Aug', price: 0.00532 },
  { name: 'Sep', price: 0.00486 },
  { name: 'Oct', price: 0.00512 },
  { name: 'Nov', price: 0.00567 },
  { name: 'Dec', price: 0.00621 },
];

const PriceChartSection: React.FC<PriceChartSectionProps> = ({
  tokenInfo,
  isLoading
}) => {
  // Format price for display
  const formatPrice = (value: number) => {
    return `$${value.toFixed(5)}`;
  };
  
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
            Last 12 months
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ChartContainer
            config={chartConfig}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockPriceData}
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
          Note: This chart shows mockup data. Historical price data would be integrated in a production environment.
        </div>
      </div>
    </>
  );
};

export default PriceChartSection;
