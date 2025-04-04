
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { CORS_HEADERS } from "../fetchTokenSupply/cors.ts";

interface RequestBody {
  days: number;
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
  
  try {
    // Parse request body
    let days = 60; // Default to 60 days
    
    if (req.method === "POST") {
      try {
        const body = await req.json() as RequestBody;
        if (body.days && typeof body.days === 'number') {
          days = body.days;
        }
      } catch (e) {
        console.error("Failed to parse request body:", e);
        // Continue with default value
      }
    }
    
    // Fetch historical price data from CoinGecko
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/dehub/market_chart?vs_currency=usd&days=${days}&interval=daily`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching historical price data:", error);
    
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
