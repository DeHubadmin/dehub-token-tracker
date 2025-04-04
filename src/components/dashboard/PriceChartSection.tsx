
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CombinedTokenData } from '@/services/tokenAPIService';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface PriceChartSectionProps {
  tokenInfo: CombinedTokenData | undefined;
  isLoading: boolean;
}

// Define the price data structure
interface PriceDataPoint {
  name: string;
  price: number;
  timestamp: number;
}

const PriceChartSection: React.FC<PriceChartSectionProps> = ({
  tokenInfo,
  isLoading
}) => {
  const [priceData, setPriceData] = useState<PriceDataPoint[]>([]);
  const [isChartLoading, setIsChartLoading] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<string>("max");

  // Format price for display
  const formatPrice = (value: number) => {
    return `$${value.toFixed(5)}`;
  };
  
  // Format date for X-axis display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short',
      year: '2-digit'
    }).format(date);
  };

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!tokenInfo) return;
      
      setIsChartLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/dehub/market_chart?vs_currency=usd&days=max`
        );
        
        if (!response.ok) {
          throw new Error(`CoinGecko API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process price data (CoinGecko returns [timestamp, price] pairs)
        if (data.prices && Array.isArray(data.prices)) {
          const formattedData = data.prices.map((item: [number, number]) => {
            return {
              timestamp: item[0],
              name: formatDate(item[0]),
              price: item[1]
            };
          });
          
          setPriceData(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch historical price data:", error);
        toast.error("Failed to fetch historical price data");
        
        // If we fail to fetch historical data, create a fallback using tokenInfo
        if (tokenInfo) {
          createFallbackPriceData();
        }
      } finally {
        setIsChartLoading(false);
      }
    };
    
    // Create fallback data when CoinGecko API fails
    const createFallbackPriceData = () => {
      if (!tokenInfo) return;
      
      const currentPrice = tokenInfo.marketData.price;
      const allTimeHigh = tokenInfo.marketData.allTimeHigh;
      const allTimeLow = tokenInfo.marketData.allTimeLow;
      
      // Key points based on the CoinGecko chart shown in the image
      const keyPoints = [
        { date: new Date('2021-01-01').getTime(), price: allTimeLow },
        { date: new Date('2021-05-01').getTime(), price: allTimeHigh * 0.4 },
        { date: new Date('2021-11-15').getTime(), price: allTimeHigh },
        { date: new Date('2022-01-01').getTime(), price: allTimeHigh * 0.3 },
        { date: new Date('2022-06-01').getTime(), price: allTimeHigh * 0.1 },
        { date: new Date('2023-01-01').getTime(), price: allTimeHigh * 0.05 },
        { date: new Date('2023-06-01').getTime(), price: allTimeHigh * 0.03 },
        { date: new Date('2024-01-01').getTime(), price: allTimeHigh * 0.02 },
        { date: new Date().getTime(), price: currentPrice }
      ];
      
      const fallbackData = keyPoints.map(point => ({
        timestamp: point.date,
        name: formatDate(point.date),
        price: point.price
      }));
      
      setPriceData(fallbackData);
      toast.warning("Using approximate price data due to API limitations");
    };
    
    fetchHistoricalData();
  }, [tokenInfo]);

  // Define config for the chart
  const chartConfig = {
    price: {
      label: 'Price',
      theme: {
        light: '#ef4444',
        dark: '#ef4444'
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

  // Loading state for the chart itself
  const isDataLoading = isChartLoading || priceData.length === 0;

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <TrendingUp size={20} className="text-red-400" />
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
            All Time (Max)
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          {isDataLoading ? (
            <div className="h-full w-full flex items-center justify-center bg-slate-800 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-400"></div>
            </div>
          ) : (
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
                    minTickGap={50}
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
                        labelFormatter={(label) => {
                          const dataPoint = priceData.find(p => p.name === label);
                          return dataPoint ? new Date(dataPoint.timestamp).toLocaleDateString() : label;
                        }}
                        formatter={(value: any) => [`$${Number(value).toFixed(5)}`, 'Price']}
                        labelClassName="text-slate-300"
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>
        
        <div className="text-xs text-slate-500 mt-2 text-center">
          Data provided by CoinGecko
        </div>
      </div>
    </>
  );
};

export default PriceChartSection;
