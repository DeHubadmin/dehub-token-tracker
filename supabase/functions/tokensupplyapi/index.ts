
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { CORS_HEADERS } from "./cors.ts";

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
    // Call the fetchtokensupply endpoint to get all data (note the lowercase name)
    const response = await fetch("https://wgmvohihwaffavfstmfr.supabase.co/functions/v1/fetchtokensupply", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Fetch token supply failed: ${response.status} ${response.statusText}`);
    }
    
    const tokenData = await response.json();
    
    // Format the supply metrics response
    const supplyMetrics = {
      totalSupply: {
        value: tokenData.totalSupplyAcrossChains,
        formatted: tokenData.formattedTotalSupplyAcrossChains,
        description: "Total tokens across all supported chains"
      },
      circulatingSupply: {
        value: tokenData.circulatingSupply,
        formatted: tokenData.formattedCirculatingSupply,
        description: "Tokens available in the market"
      },
      maxSupply: {
        value: tokenData.maxSupply,
        formatted: tokenData.formattedMaxSupply,
        description: "Maximum possible token supply"
      },
      lastUpdated: tokenData.lastUpdated
    };
    
    return new Response(JSON.stringify(supplyMetrics), {
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
