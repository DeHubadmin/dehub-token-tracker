
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface SupplyMetrics {
  totalSupply: {
    value: number;
    formatted: string;
    description: string;
  };
  circulatingSupply: {
    value: number;
    formatted: string;
    description: string;
  };
  maxSupply: {
    value: number;
    formatted: string;
    description: string;
  };
  lastUpdated: string;
}

export interface ChainSupply {
  name: string;
  chainId: number;
  tokenAddress: string;
  supply: {
    value: number;
    formatted: string;
    percentage: number;
  };
  scannerUrl: string;
}

export interface ChainBreakdown {
  chains: ChainSupply[];
  totalSupplyAcrossChains: {
    value: number;
    formatted: string;
  };
  lastUpdated: string;
}

export interface HolderChange {
  value: number;
  formatted: string;
  timestamp: string;
}

export interface HolderStats {
  currentHolderCount: number;
  formattedHolderCount: string;
  changes: {
    day: HolderChange;
    week: HolderChange;
    month: HolderChange;
    year: HolderChange;
  };
  lastUpdated: string;
}

export interface TokenHolder {
  rank: number;
  address: string;
  balance: number;
  formattedBalance: string;
  percentage: string;
  lastChanged: string;
}

export interface TokenTransfer {
  txHash: string;
  from: string;
  to: string;
  amount: number;
  formattedAmount: string;
  timestamp: string;
  chain: string;
  scannerUrl: string;
}

export interface HolderData {
  holderStats: HolderStats;
  topHolders: TokenHolder[];
  recentTransfers: TokenTransfer[];
}

export interface CombinedTokenData {
  name: string;
  symbol: string;
  supplyMetrics: SupplyMetrics;
  chainBreakdown: ChainBreakdown;
  holderData?: HolderData;
  marketData: {
    price: number;
    formattedPrice: string;
    marketCap: number;
    formattedMarketCap: string;
    totalVolume: number;
    formattedTotalVolume: string;
    priceChangePercentage24h: number;
    priceChangePercentage7d: number;
    lastUpdated: string;
  };
}

export async function fetchSupplyMetrics(): Promise<SupplyMetrics | null> {
  try {
    console.log("Fetching supply metrics from tokensupplyapi");
    const { data, error } = await supabase.functions.invoke('tokensupplyapi', {
      method: 'GET'
    });
    
    if (error) {
      console.error("Error invoking tokensupplyapi function:", error);
      toast.error("Failed to fetch supply metrics");
      return null;
    }
    
    console.log("Supply metrics response:", data);
    return data as SupplyMetrics;
  } catch (error) {
    console.error("Failed to fetch supply metrics:", error);
    toast.error("Failed to fetch supply metrics");
    return null;
  }
}

export async function fetchChainBreakdown(): Promise<ChainBreakdown | null> {
  try {
    const { data, error } = await supabase.functions.invoke('chainbreakdownapi', {
      method: 'GET'
    });
    
    if (error) {
      console.error("Error invoking chainbreakdownapi function:", error);
      toast.error("Failed to fetch chain breakdown");
      return null;
    }
    
    return data as ChainBreakdown;
  } catch (error) {
    console.error("Failed to fetch chain breakdown:", error);
    toast.error("Failed to fetch chain breakdown");
    return null;
  }
}

export async function fetchHolderData(): Promise<HolderData | null> {
  try {
    console.log("Fetching holder data from tokenholderapi");
    const { data, error } = await supabase.functions.invoke('tokenholderapi', {
      method: 'GET'
    });
    
    if (error) {
      console.error("Error invoking tokenholderapi function:", error);
      toast.error("Failed to fetch holder data");
      return null;
    }
    
    console.log("Holder data response:", data);
    return data as HolderData;
  } catch (error) {
    console.error("Failed to fetch holder data:", error);
    toast.error("Failed to fetch holder data");
    return null;
  }
}

export async function fetchCombinedTokenData(): Promise<CombinedTokenData | null> {
  try {
    const { data, error } = await supabase.functions.invoke('combinedtokenapi', {
      method: 'GET'
    });
    
    if (error) {
      console.error("Error invoking combinedtokenapi function:", error);
      toast.error("Failed to fetch token data");
      return null;
    }
    
    // Fetch holder data separately to get real-time data
    const holderData = await fetchHolderData();
    
    // Combine the data
    const combinedData = {
      ...data as CombinedTokenData,
      holderData: holderData || undefined
    };
    
    return combinedData;
  } catch (error) {
    console.error("Failed to fetch combined token data:", error);
    toast.error("Failed to fetch token data");
    return null;
  }
}
