
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface HistoricalPriceData {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][]; // [timestamp, market_cap]
  total_volumes: [number, number][]; // [timestamp, volume]
}

/**
 * Fetches historical price data for the specified number of days
 * @param days Number of days of historical data to fetch
 * @returns Historical price data or null if error
 */
export async function fetchHistoricalPriceData(days: number = 365): Promise<HistoricalPriceData | null> {
  try {
    const { data, error } = await supabase.functions.invoke('historical-price', {
      method: 'POST',
      body: { days }
    });
    
    if (error) {
      console.error("Error fetching historical price data:", error);
      toast.error("Failed to fetch price history");
      return null;
    }
    
    return data as HistoricalPriceData;
  } catch (error) {
    console.error("Failed to fetch historical price data:", error);
    toast.error("Failed to fetch price history");
    return null;
  }
}

/**
 * Fetches maximum available historical price data
 * @returns Historical price data or null if error
 */
export async function fetchMaxHistoricalPriceData(): Promise<HistoricalPriceData | null> {
  try {
    const { data, error } = await supabase.functions.invoke('historical-price', {
      method: 'POST',
      body: { max: true }
    });
    
    if (error) {
      console.error("Error fetching max historical price data:", error);
      toast.error("Failed to fetch price history");
      return null;
    }
    
    return data as HistoricalPriceData;
  } catch (error) {
    console.error("Failed to fetch max historical price data:", error);
    toast.error("Failed to fetch price history");
    return null;
  }
}
