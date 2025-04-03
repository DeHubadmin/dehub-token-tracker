
// This is a mock service that would be replaced with real API calls
// to blockchain explorers or a backend service that aggregates the data

import { toast } from "sonner";

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

const MOCK_TOKEN_INFO: TokenInfo = {
  name: "DeHub",
  symbol: "DHB",
  maxSupply: 8_000_000_000,
  formattedMaxSupply: "8,000,000,000",
  circulatingSupply: 8_000_000_000, // Fully diluted as specified
  formattedCirculatingSupply: "8,000,000,000",
  chains: [
    {
      chain: "BNB Chain",
      chainId: 56,
      tokenAddress: "0x680d3113caf77b61b510f332d5ef4cf5b41a761d",
      totalSupply: 4_500_000_000, // Mock value, would be fetched from API
      formattedTotalSupply: "4,500,000,000",
      decimals: 18,
      scannerUrl: "https://bscscan.com/token/0x680d3113caf77b61b510f332d5ef4cf5b41a761d"
    },
    {
      chain: "Base",
      chainId: 8453,
      tokenAddress: "0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c",
      totalSupply: 3_500_000_000, // Mock value, would be fetched from API
      formattedTotalSupply: "3,500,000,000",
      decimals: 18,
      scannerUrl: "https://basescan.org/token/0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c"
    }
  ],
  totalSupplyAcrossChains: 8_000_000_000,
  formattedTotalSupplyAcrossChains: "8,000,000,000"
};

// In a real implementation, this would fetch data from an API
export async function fetchTokenInfo(): Promise<TokenInfo> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, this would call a real API
    // const response = await fetch('/api/token-info');
    // const data = await response.json();
    // return data;
    
    return MOCK_TOKEN_INFO;
  } catch (error) {
    console.error("Failed to fetch token info:", error);
    toast.error("Failed to fetch token data");
    throw error;
  }
}
