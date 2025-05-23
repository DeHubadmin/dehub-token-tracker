import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchHistoricalPriceData } from "@/services/historicalPriceService";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import LoadingSpinner from '../LoadingSpinner';
import CoinGeckoLink from './CoinGeckoLink';
interface PriceDataPoint {
  time: number; // Changed from string to number
  value: number;
}
interface HistoricalPriceData {
  prices: [number, number][];
}
const formatXAxis = (tickItem: number) => {
  // Make sure we're dealing with a valid timestamp
  if (!tickItem || isNaN(Number(tickItem))) return '';
  try {
    // Format as "MMM yy" to get "Apr 24" format
    return format(new Date(tickItem), "MMM yy");
  } catch (e) {
    console.error("Error formatting date:", e, tickItem);
    return '';
  }
};
const formatYAxis = (tickItem: number) => {
  return tickItem.toFixed(5); // Changed from 2 to 5 decimal places
};
const CustomTooltip = ({
  active,
  payload,
  label
}: any) => {
  if (active && payload && payload.length) {
    try {
      return <div className="bg-gray-800 text-white p-2 rounded-md">
          <p className="label">{format(new Date(label), "MMM yy, yyyy")}</p>
          <p className="intro">{`Price: $${payload[0].value.toFixed(5)}`}</p> {/* Changed from 2 to 5 decimal places */}
        </div>;
    } catch (e) {
      console.error("Error in tooltip:", e);
      return null;
    }
  }
  return null;
};

// Main component that combines everything
const PriceChartSection = () => {
  const [timeRange, setTimeRange] = useState("365"); // Default to 365 days
  const [chartData, setChartData] = useState<PriceDataPoint[]>([]);
  const {
    data,
    isLoading,
    isError
  } = useQuery<HistoricalPriceData>({
    queryKey: ['historicalPriceData', timeRange],
    queryFn: () => fetchHistoricalPriceData(parseInt(timeRange))
  });
  useEffect(() => {
    if (data && data.prices) {
      try {
        // Ensure prices are available and not undefined
        const formattedData: PriceDataPoint[] = data.prices.map(([timestamp, price]) => ({
          time: timestamp,
          // Store as number (timestamp) instead of string
          value: price
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Error processing chart data:", error);
        setChartData([]);
      }
    }
  }, [data]);
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p className="text-red-500">Error fetching data</p>;
  return <Card className="col-span-3 bg-dehub-card border-dehub-border">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white">Price History</CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="365">Last 1 Year</SelectItem>
              <SelectItem value="1095">Last 3 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CoinGeckoLink />
      </CardHeader>
      <CardContent className="pt-0">
        {chartData.length > 0 ? <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tickFormatter={formatXAxis} stroke="#6B7280" interval="preserveStartEnd" tickMargin={5} type="number" domain={['dataMin', 'dataMax']} />
              <YAxis stroke="#6B7280" tickFormatter={formatYAxis} tickMargin={5} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="url(#priceGradient)" />
            </AreaChart>
          </ResponsiveContainer> : <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-400">No data available for the selected time range</p>
          </div>}
      </CardContent>
    </Card>;
};
export default PriceChartSection;