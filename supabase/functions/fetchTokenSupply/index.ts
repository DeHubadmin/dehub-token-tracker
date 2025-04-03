
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { CORS_HEADERS } from "./cors.ts";
import { formatCurrency, formatPrice, formatNumber } from "./formatters.ts";
import { fetchMarketData } from "./marketData.ts";
import { fetchBNBChainSupply, fetchBaseChainSupply } from "./chainSupply.ts";

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
