
import { formatNumber } from "./formatters.ts";

// Function to fetch BNB chain token supply
export async function fetchBNBChainSupply() {
  const bscTokenAddress = "0x680d3113caf77b61b510f332d5ef4cf5b41a761d";
  const bscScanApiKey = Deno.env.get("BSCSCAN_API_KEY") || "";
  
  if (!bscScanApiKey) {
    console.warn("BSCSCAN_API_KEY not set");
  }
  
  const response = await fetch(
    `https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${bscTokenAddress}&apikey=${bscScanApiKey}`
  );
  
  if (!response.ok) {
    throw new Error(`BscScan API returned ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (data.status !== "1") {
    throw new Error(`BscScan API error: ${data.message}`);
  }
  
  // BscScan returns token supply in wei (10^18), so we need to convert to token units
  const totalSupply = parseInt(data.result) / 10**18;
  
  return {
    chain: "BNB Chain",
    chainId: 56,
    tokenAddress: bscTokenAddress,
    totalSupply,
    formattedTotalSupply: formatNumber(totalSupply),
    decimals: 18,
    scannerUrl: `https://bscscan.com/token/${bscTokenAddress}`
  };
}

// Function to fetch Base chain token supply
export async function fetchBaseChainSupply() {
  const baseTokenAddress = "0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c";
  
  // For Base, we'll use their public RPC instead of an API since they don't have a convenient API like BscScan
  const rpcEndpoint = "https://mainnet.base.org";
  
  const response = await fetch(rpcEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [
        {
          to: baseTokenAddress,
          data: "0x18160ddd" // totalSupply() function signature
        },
        "latest"
      ]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Base RPC returned ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!data.result) {
    throw new Error(`Base RPC error: ${data.error?.message || "Unknown error"}`);
  }
  
  // Convert hex result to decimal and divide by 10^18 to get the token amount
  const totalSupply = parseInt(data.result, 16) / 10**18;
  
  return {
    chain: "Base",
    chainId: 8453,
    tokenAddress: baseTokenAddress,
    totalSupply,
    formattedTotalSupply: formatNumber(totalSupply),
    decimals: 18,
    scannerUrl: `https://basescan.org/token/${baseTokenAddress}`
  };
}
