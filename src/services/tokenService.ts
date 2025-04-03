
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
  priceChangePercentage24h?: number;
  priceChangePercentage7d?: number;
  priceChangePercentage30d?: number;
  priceChangePercentage90d?: number;
  priceChangePercentage1y?: number;
  priceChangePercentageAllTime?: number;
  high24h?: number;
  formattedHigh24h?: string;
  low24h?: number;
  formattedLow24h?: string;
  lastUpdated?: string;
}

// Fallback mock data in case the API fails
const MOCK_TOKEN_INFO: TokenInfo = {
  name: "DeHub",
  symbol: "DHB",
  maxSupply: 8_000_000_000,
  formattedMaxSupply: "8,000,000,000",
  circulatingSupply: 8_000_000_000,
  formattedCirculatingSupply: "8,000,000,000",
  chains: [
    {
      chain: "BNB Chain",
      chainId: 56,
      tokenAddress: "0x680d3113caf77b61b510f332d5ef4cf5b41a761d",
      totalSupply: 4_500_000_000,
      formattedTotalSupply: "4,500,000,000",
      decimals: 18,
      scannerUrl: "https://bscscan.com/token/0x680d3113caf77b61b510f332d5ef4cf5b41a761d"
    },
    {
      chain: "Base",
      chainId: 8453,
      tokenAddress: "0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c",
      totalSupply: 3_500_000_000,
      formattedTotalSupply: "3,500,000,000",
      decimals: 18,
      scannerUrl: "https://basescan.org/token/0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c"
    }
  ],
  totalSupplyAcrossChains: 8_000_000_000,
  formattedTotalSupplyAcrossChains: "8,000,000,000",
  // Mock market data
  price: 0.012,
  formattedPrice: "$0.012",
  marketCap: 95320353,
  formattedMarketCap: "$95,320,353.00",
  totalVolume: 2345678,
  formattedTotalVolume: "$2,345,678.00",
  priceChange24h: 0.00023,
  priceChangePercentage24h: 1.95,
  priceChangePercentage7d: 5.25,
  priceChangePercentage30d: -2.15,
  priceChangePercentage90d: 8.75,
  priceChangePercentage1y: -12.35,
  priceChangePercentageAllTime: 125.50,
  high24h: 0.0125,
  formattedHigh24h: "$0.0125",
  low24h: 0.0115,
  formattedLow24h: "$0.0115",
  lastUpdated: new Date().toISOString()
}

export async function fetchTokenInfo(): Promise<TokenInfo> {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('fetchTokenSupply');
    
    if (error) {
      console.error("Error invoking fetchTokenSupply function:", error);
      toast.error("Failed to fetch live token data");
      return MOCK_TOKEN_INFO;
    }
    
    return data as TokenInfo;
  } catch (error) {
    console.error("Failed to fetch token info:", error);
    toast.error("Failed to fetch token data");
    return MOCK_TOKEN_INFO;
  }
}
