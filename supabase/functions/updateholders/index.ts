
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Define CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, ApiKey",
  "Access-Control-Max-Age": "86400",
};

// Function to handle the request
async function handleRequest(req: Request) {
  // Get supabase client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }
  
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Only POST requests are supported" }),
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
    console.log("Processing holder data update request");
    
    // Parse the request body
    const { 
      holders, 
      bnbChainHolders, 
      baseChainHolders,
      dayChangePercent,
      weekChangePercent,
      monthChangePercent,
      yearChangePercent,
      apiKey 
    } = await req.json();
    
    // Simple API key validation - in production, use a more secure approach
    const validApiKey = Deno.env.get("ADMIN_API_KEY") || "";
    if (!apiKey || apiKey !== validApiKey) {
      return new Response(
        JSON.stringify({ error: "Invalid API key" }),
        {
          status: 401,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // Verify that holders is an array
    if (!Array.isArray(holders)) {
      return new Response(
        JSON.stringify({ error: "Holders data must be an array" }),
        {
          status: 400,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // Clear existing token holders
    const { error: deleteError } = await supabase
      .from('token_holders')
      .delete()
      .neq('id', 0); // Delete all records
    
    if (deleteError) {
      throw new Error(`Failed to clear existing token holders: ${deleteError.message}`);
    }
    
    // Insert new token holders
    if (holders.length > 0) {
      const { error: insertError } = await supabase
        .from('token_holders')
        .insert(holders);
      
      if (insertError) {
        throw new Error(`Failed to insert token holders: ${insertError.message}`);
      }
    }
    
    // Update holder stats
    const { error: statsError } = await supabase
      .from('holder_stats')
      .insert({
        total_holders: (bnbChainHolders || 0) + (baseChainHolders || 0),
        bnb_chain_holders: bnbChainHolders || 0,
        base_chain_holders: baseChainHolders || 0,
        day_change_percent: dayChangePercent || 2.6,
        week_change_percent: weekChangePercent || 5.8,
        month_change_percent: monthChangePercent || 12.4,
        year_change_percent: yearChangePercent || 52.5
      });
    
    if (statsError) {
      throw new Error(`Failed to update holder stats: ${statsError.message}`);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Holder data updated successfully",
        holdersProcessed: holders.length
      }),
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating holder data:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update holder data" }),
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
