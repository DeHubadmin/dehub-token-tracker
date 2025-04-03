
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Number formatter utility
function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Fetch token info from BscScan
async function fetchBscTokenInfo() {
  try {
    // BscScan API endpoint for token supply
    const apiKey = Deno.env.get("BSCSCAN_API_KEY") || "";
    const tokenAddress = "0x680d3113caf77b61b510f332d5ef4cf5b41a761d";
    const url = `https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${tokenAddress}&apikey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === "1") {
      // Convert from wei (18 decimals)
      const totalSupply = parseFloat(data.result) / Math.pow(10, 18);
      return {
        chain: "BNB Chain",
        chainId: 56,
        tokenAddress: tokenAddress,
        totalSupply: totalSupply,
        formattedTotalSupply: formatNumber(totalSupply),
        decimals: 18,
        scannerUrl: `https://bscscan.com/token/${tokenAddress}`
      };
    } else {
      console.error("BscScan API error:", data.message);
      throw new Error(`BscScan API error: ${data.message}`);
    }
  } catch (error) {
    console.error("Error fetching BNB Chain data:", error);
    // Fallback to mock data
    return {
      chain: "BNB Chain",
      chainId: 56,
      tokenAddress: "0x680d3113caf77b61b510f332d5ef4cf5b41a761d",
      totalSupply: 4_500_000_000,
      formattedTotalSupply: "4,500,000,000",
      decimals: 18,
      scannerUrl: "https://bscscan.com/token/0x680d3113caf77b61b510f332d5ef4cf5b41a761d"
    };
  }
}

// Fetch token info from BaseScan
async function fetchBaseTokenInfo() {
  try {
    // BaseScan API endpoint for token supply
    const apiKey = Deno.env.get("BASESCAN_API_KEY") || "";
    const tokenAddress = "0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c";
    const url = `https://api.basescan.org/api?module=stats&action=tokensupply&contractaddress=${tokenAddress}&apikey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === "1") {
      // Convert from wei (18 decimals)
      const totalSupply = parseFloat(data.result) / Math.pow(10, 18);
      return {
        chain: "Base",
        chainId: 8453,
        tokenAddress: tokenAddress,
        totalSupply: totalSupply,
        formattedTotalSupply: formatNumber(totalSupply),
        decimals: 18,
        scannerUrl: `https://basescan.org/token/${tokenAddress}`
      };
    } else {
      console.error("BaseScan API error:", data.message);
      throw new Error(`BaseScan API error: ${data.message}`);
    }
  } catch (error) {
    console.error("Error fetching Base Chain data:", error);
    // Fallback to mock data
    return {
      chain: "Base",
      chainId: 8453,
      tokenAddress: "0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c",
      totalSupply: 3_500_000_000,
      formattedTotalSupply: "3,500,000,000",
      decimals: 18,
      scannerUrl: "https://basescan.org/token/0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c"
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch token supply from both chains
    const [bnbChainData, baseChainData] = await Promise.all([
      fetchBscTokenInfo(),
      fetchBaseTokenInfo()
    ]);

    // Calculate total supply across chains
    const totalSupplyAcrossChains = bnbChainData.totalSupply + baseChainData.totalSupply;

    // Construct the token info
    const tokenInfo = {
      name: "DeHub",
      symbol: "DHB",
      maxSupply: 8_000_000_000,
      formattedMaxSupply: "8,000,000,000",
      circulatingSupply: totalSupplyAcrossChains,
      formattedCirculatingSupply: formatNumber(totalSupplyAcrossChains),
      chains: [bnbChainData, baseChainData],
      totalSupplyAcrossChains: totalSupplyAcrossChains,
      formattedTotalSupplyAcrossChains: formatNumber(totalSupplyAcrossChains)
    };

    return new Response(JSON.stringify(tokenInfo), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in edge function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
