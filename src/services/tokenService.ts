
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
  formattedTotalSupplyAcrossChains: "8,000,000,000"
};

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
