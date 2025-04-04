
import React, { useState, useEffect } from 'react';
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
  date: Date;
  price: number;
}

const PriceChartSection: React.FC<PriceChartSectionProps> = ({
  tokenInfo,
  isLoading
}) => {
  // State to store historical price data
  const [historicalData, setHistoricalData] = useState<PriceDataPoint[]>([]);
  const [isHistoricalDataLoading, setIsHistoricalDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);
  
  // Fetch historical data
  useEffect(() => {
    async function fetchHistoricalData() {
      setIsHistoricalDataLoading(true);
      try {
        const response = await fetch('/api/historical-price');
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        setHistoricalData(data);
        setDataError(null);
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
        setDataError('Failed to load historical price data');
      } finally {
        setIsHistoricalDataLoading(false);
      }
    }
    
    fetchHistoricalData();
  }, []);
  
  // Format price for display
  const formatPrice = (value: number) => {
    return `$${value < 0.001 ? value.toFixed(6) : value.toFixed(5)}`;
  };
  
  // Format date for tooltip
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format date for X-axis
  const formatXAxis = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };
  
  // Define chart config
  const chartConfig = {
    price: {
      label: 'Price',
      theme: {
        light: '#ff4b45',
        dark: '#ff4b45'
      }
    }
  };
  
  // Show loading state
  if (isLoading || isHistoricalDataLoading) {
    return (
      <div className="mb-8">
        <div className="h-8 w-48 bg-slate-700 rounded animate-pulse mb-4"></div>
        <div className="h-[300px] bg-slate-800 rounded-lg animate-pulse"></div>
      </div>
    );
  }
  
  // Show error state
  if (dataError || !tokenInfo) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <TrendingUp size={20} className="text-red-400" />
          Price Chart
        </h2>
        <div className="p-4 bg-slate-800 rounded-lg mb-8 text-center">
          <p className="text-red-400">
            {dataError || "Unable to load price chart data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <TrendingUp size={20} className="text-red-400" />
        Price Chart
      </h2>
      
      <div className="p-4 bg-[#121c36] rounded-lg mb-8">
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
            From Jan 2021 to Present
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ChartContainer
            config={chartConfig}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalData}
                margin={{ top: 10, right: 25, left: 10, bottom: 30 }}
              >
                <YAxis 
                  scale="log"
                  domain={['auto', 'auto']}
                  tickFormatter={formatPrice}
                  tick={{ fill: '#9ca3af' }}
                  axisLine={{ stroke: '#4b5563' }}
                  tickCount={5}
                />
                <XAxis 
                  dataKey="date"
                  tickFormatter={formatXAxis}
                  tick={{ fill: '#9ca3af' }}
                  axisLine={{ stroke: '#4b5563' }}
                  minTickGap={50}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => formatDate(new Date(label))}
                      formatter={(value: any) => [`$${Number(value).toFixed(6)}`, 'Price']}
                      labelClassName="text-slate-300"
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#ff4b45"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#ff4b45', stroke: '#fff', strokeWidth: 1 }}
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
