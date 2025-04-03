
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

// Define CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, ApiKey",
  "Access-Control-Max-Age": "86400",
};

// Handle requests
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
    // Call the main fetchTokenSupply function to avoid duplicating logic
    const url = new URL(req.url);
    const targetFunction = "fetchTokenSupply";
    
    // Forward the request to the fetchTokenSupply function
    const response = await fetch(
      `${url.protocol}//${url.host}/functions/v1/${targetFunction}`,
      {
        method: "GET",
        headers: req.headers
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching token data: ${response.status} ${response.statusText}`);
    }
    
    const tokenData = await response.json();
    
    // Calculate percentages and format chain data
    const chains = tokenData.chains.map(chain => {
      const percentage = (chain.totalSupply / (tokenData.totalSupplyAcrossChains || 1)) * 100;
      return {
        name: chain.chain,
        chainId: chain.chainId,
        tokenAddress: chain.tokenAddress,
        supply: {
          value: chain.totalSupply,
          formatted: chain.formattedTotalSupply,
          percentage: parseFloat(percentage.toFixed(1))
        },
        scannerUrl: chain.scannerUrl
      };
    });
    
    return new Response(JSON.stringify({
      chains,
      totalSupplyAcrossChains: {
        value: tokenData.totalSupplyAcrossChains,
        formatted: tokenData.formattedTotalSupplyAcrossChains
      },
      lastUpdated: tokenData.lastUpdated
    }), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error handling request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch chain breakdown" }),
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
