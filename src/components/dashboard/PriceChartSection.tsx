
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
  
  // Generate price data from 2021 to present
  const priceData = useMemo(() => {
    if (!tokenInfo) return [];
    
    const currentPrice = tokenInfo.marketData.price;
    const allTimeHigh = tokenInfo.marketData.allTimeHigh;
    const allTimeLow = tokenInfo.marketData.allTimeLow;
    
    // Create a function to calculate historical prices
    const calculateHistoricalPrice = (date: Date): number => {
      const now = new Date();
      const timeDiff = now.getTime() - date.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      
      // If within the range of our percentage data
      if (daysDiff <= 30) {
        return currentPrice / (1 + (tokenInfo.marketData.priceChangePercentage30d / 100));
      } else if (daysDiff <= 365) {
        return currentPrice / (1 + (tokenInfo.marketData.priceChangePercentage1y / 100));
      } else {
        // For older dates, simulate a curve from all-time low to current
        // Early 2021 was close to all-time low
        // Mid 2021 to early 2022 was the bull run to all-time high
        // Then a decline and recent stabilization
        
        // Rough key price points (these are approximations)
        const keyPoints = [
          { date: new Date('2021-01-01').getTime(), price: allTimeLow },
          { date: new Date('2021-05-01').getTime(), price: allTimeLow * 10 },
          { date: new Date('2021-11-15').getTime(), price: allTimeHigh },
          { date: new Date('2022-06-01').getTime(), price: allTimeHigh * 0.4 },
          { date: new Date('2022-12-01').getTime(), price: allTimeHigh * 0.2 },
          { date: new Date('2023-06-01').getTime(), price: allTimeHigh * 0.15 },
          { date: new Date('2024-01-01').getTime(), price: allTimeHigh * 0.1 },
          { date: now.getTime(), price: currentPrice }
        ];
        
        // Find the two closest key points to our target date
        const targetTime = date.getTime();
        let before = keyPoints[0];
        let after = keyPoints[keyPoints.length - 1];
        
        for (let i = 0; i < keyPoints.length - 1; i++) {
          if (keyPoints[i].date <= targetTime && keyPoints[i + 1].date >= targetTime) {
            before = keyPoints[i];
            after = keyPoints[i + 1];
            break;
          }
        }
        
        // Linear interpolation between the two points
        const ratio = (targetTime - before.date) / (after.date - before.date);
        return before.price + ratio * (after.price - before.price);
      }
    };
    
    // Generate monthly data points from Jan 2021 to now
    const dataPoints: PriceDataPoint[] = [];
    const startDate = new Date('2021-01-01');
    const endDate = new Date();
    
    // Loop through each month from start to end
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthName = new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(currentDate);
      
      dataPoints.push({
        name: monthName,
        price: calculateHistoricalPrice(new Date(currentDate)),
        timestamp: new Date(currentDate)
      });
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Add current price as the last point if not already included
    if (dataPoints.length > 0 && dataPoints[dataPoints.length - 1].timestamp.getMonth() !== endDate.getMonth()) {
      dataPoints.push({
        name: 'Now',
        price: currentPrice,
        timestamp: endDate
      });
    }
    
    return dataPoints;
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
            From Jan 2021 to Present
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
                  dot={false}
                  activeDot={{ r: 5, fill: '#33C3F0', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="text-xs text-slate-500 mt-2 text-center">
          Note: This chart shows approximated historical data since 2021. For a more accurate chart, a historical price API would be needed.
        </div>
      </div>
    </>
  );
};

export default PriceChartSection;
