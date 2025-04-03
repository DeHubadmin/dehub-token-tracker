
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface TokenSupply {
  chain: string;
  chainId: number;
  tokenAddress: string;
  totalSupply: number;
  formattedTotalSupply: string;
  decimals: number;
  scannerUrl: string;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  maxSupply: number;
  formattedMaxSupply: string;
  circulatingSupply: number;
  formattedCirculatingSupply: string;
  chains: TokenSupply[];
  totalSupplyAcrossChains: number;
  formattedTotalSupplyAcrossChains: string;
  // Market data
  price?: number;
  formattedPrice?: string;
  marketCap?: number;
  formattedMarketCap?: string;
  totalVolume?: number;
  formattedTotalVolume?: string;
  priceChange24h?: number;
  priceChangePercentage1h?: number;
  priceChangePercentage24h?: number;
  priceChangePercentage7d?: number;
  priceChangePercentage14d?: number;
  priceChangePercentage30d?: number;
  priceChangePercentage1y?: number;
  priceChangePercentageAllTime?: number;
  priceChangePercentageFromATH?: number;
  multiplesToATH?: number;
  allTimeHigh?: number;
  formattedAllTimeHigh?: string;
  allTimeLow?: number;
  formattedAllTimeLow?: string;
  high24h?: number;
  formattedHigh24h?: string;
  low24h?: number;
  formattedLow24h?: string;
  lastUpdated?: string;
}

export async function fetchTokenInfo(): Promise<TokenInfo | null> {
  try {
    // Call the Supabase Edge Function with GET method - note the lowercase function name
    const { data, error } = await supabase.functions.invoke('fetchtokensupply', {
      method: 'GET'
    });
    
    if (error) {
      console.error("Error invoking fetchtokensupply function:", error);
      toast.error("Failed to fetch live token data");
      return null;
    }
    
    return data as TokenInfo;
  } catch (error) {
    console.error("Failed to fetch token info:", error);
    toast.error("Failed to fetch token data");
    return null;
  }
}
