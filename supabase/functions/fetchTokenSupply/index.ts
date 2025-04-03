
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

// Define CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, ApiKey",
  "Access-Control-Max-Age": "86400",
};

// Utility function to format numbers as currency
function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

// Utility function to format price with 5 decimal places
function formatPrice(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  }).format(num);
}

// Utility function to format large numbers with commas
function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Function to fetch market data from CoinGecko
async function fetchMarketData() {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=dehub&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=1h,24h,7d,14d,30d,1y"
  );
  
  if (!response.ok) {
    throw new Error(`CoinGecko API returned ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  const tokenData = data[0];
  
  if (!tokenData) {
    throw new Error("No token data returned from CoinGecko");
  }
  
  // Update with correct all-time high value
  const allTimeHigh = 0.065;
  const allTimeLow = 0.00008;
  const changeFromATH = ((tokenData.current_price - allTimeHigh) / allTimeHigh) * 100;
  
  return {
    price: tokenData.current_price,
    totalVolume: tokenData.total_volume,
    priceChange24h: tokenData.price_change_24h,
    priceChangePercentage1h: tokenData.price_change_percentage_1h_in_currency,
    priceChangePercentage24h: tokenData.price_change_percentage_24h,
    priceChangePercentage7d: tokenData.price_change_percentage_7d_in_currency,
    priceChangePercentage14d: tokenData.price_change_percentage_14d_in_currency,
    priceChangePercentage30d: tokenData.price_change_percentage_30d_in_currency,
    priceChangePercentage1y: tokenData.price_change_percentage_1y_in_currency,
    priceChangePercentageAllTime: 156.75, // Hard to get from API, keeping this hard-coded
    priceChangePercentageFromATH: changeFromATH,
    allTimeHigh: allTimeHigh,
    formattedAllTimeHigh: formatPrice(allTimeHigh),
    allTimeLow: allTimeLow,
    formattedAllTimeLow: formatPrice(allTimeLow),
    high24h: tokenData.high_24h,
    low24h: tokenData.low_24h,
    lastUpdated: tokenData.last_updated
  };
}

// Function to fetch BNB chain token supply
async function fetchBNBChainSupply() {
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
async function fetchBaseChainSupply() {
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

// Main function to handle the request
async function handleRequest(req: Request) {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }
  
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Only GET requests are supported" }),
      {
        status: 405,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  }
  
  try {
    // Fetch data from all sources in parallel
    const [marketData, bnbChainData, baseChainData] = await Promise.all([
      fetchMarketData(),
      fetchBNBChainSupply(),
      fetchBaseChainSupply()
    ]);

    // Calculate total supply across chains
    const totalSupplyAcrossChains = bnbChainData.totalSupply + baseChainData.totalSupply;
    
    // Calculate market cap based on price and total supply
    const calculatedMarketCap = marketData.price * totalSupplyAcrossChains;

    // Construct the token info
    const tokenInfo = {
      name: "DeHub",
      symbol: "DHB",
      maxSupply: 8_000_000_000,
      formattedMaxSupply: "8,000,000,000",
      circulatingSupply: totalSupplyAcrossChains, // Assume all tokens are circulating
      formattedCirculatingSupply: formatNumber(totalSupplyAcrossChains),
      chains: [bnbChainData, baseChainData],
      totalSupplyAcrossChains,
      formattedTotalSupplyAcrossChains: formatNumber(totalSupplyAcrossChains),
      // Market data
      price: marketData.price,
      formattedPrice: formatPrice(marketData.price),
      marketCap: calculatedMarketCap,
      formattedMarketCap: formatCurrency(calculatedMarketCap),
      totalVolume: marketData.totalVolume,
      formattedTotalVolume: formatCurrency(marketData.totalVolume),
      priceChange24h: marketData.priceChange24h,
      priceChangePercentage1h: marketData.priceChangePercentage1h,
      priceChangePercentage24h: marketData.priceChangePercentage24h,
      priceChangePercentage7d: marketData.priceChangePercentage7d,
      priceChangePercentage14d: marketData.priceChangePercentage14d,
      priceChangePercentage30d: marketData.priceChangePercentage30d,
      priceChangePercentage1y: marketData.priceChangePercentage1y,
      priceChangePercentageAllTime: marketData.priceChangePercentageAllTime,
      priceChangePercentageFromATH: marketData.priceChangePercentageFromATH,
      allTimeHigh: marketData.allTimeHigh,
      formattedAllTimeHigh: marketData.formattedAllTimeHigh,
      allTimeLow: marketData.allTimeLow,
      formattedAllTimeLow: marketData.formattedAllTimeLow,
      high24h: marketData.high24h,
      formattedHigh24h: formatPrice(marketData.high24h),
      low24h: marketData.low24h,
      formattedLow24h: formatPrice(marketData.low24h),
      lastUpdated: marketData.lastUpdated
    };
    
    return new Response(JSON.stringify(tokenInfo), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error handling request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch token data" }),
      {
        status: 500,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Serve the function
serve(handleRequest);
