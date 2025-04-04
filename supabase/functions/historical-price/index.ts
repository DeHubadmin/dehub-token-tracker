
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { CORS_HEADERS } from "../fetchtokensupply/cors.ts";
import { fetchHistoricalPriceData } from "../fetchtokensupply/marketData.ts";

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
    // Fetch historical price data
    const historicalData = await fetchHistoricalPriceData();
    
    if (!historicalData) {
      throw new Error("Failed to fetch historical price data");
    }
    
    return new Response(JSON.stringify(historicalData), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error handling request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch historical price data" }),
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
