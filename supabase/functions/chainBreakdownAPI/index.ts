
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { CORS_HEADERS } from "../fetchTokenSupply/cors.ts";

// Function to handle the request
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
    // Call the fetchTokenSupply endpoint to get all data
    const response = await fetch("https://wgmvohihwaffavfstmfr.supabase.co/functions/v1/fetchTokenSupply", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Fetch token supply failed: ${response.status} ${response.statusText}`);
    }
    
    const tokenData = await response.json();
    
    // Format the chain breakdown response
    const chainBreakdown = {
      chains: tokenData.chains.map((chain: any) => ({
        name: chain.chain,
        chainId: chain.chainId,
        tokenAddress: chain.tokenAddress,
        supply: {
          value: chain.totalSupply,
          formatted: chain.formattedTotalSupply,
          percentage: (chain.totalSupply / tokenData.totalSupplyAcrossChains) * 100
        },
        scannerUrl: chain.scannerUrl
      })),
      totalSupplyAcrossChains: {
        value: tokenData.totalSupplyAcrossChains,
        formatted: tokenData.formattedTotalSupplyAcrossChains
      },
      lastUpdated: tokenData.lastUpdated
    };
    
    return new Response(JSON.stringify(chainBreakdown), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error handling request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch chain data" }),
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
