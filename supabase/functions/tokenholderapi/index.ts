import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Define CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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
    console.log("Processing tokenholderapi request");
    
    // Fetch holder stats from the database
    const { data: holderStatsData, error: holderStatsError } = await supabase
      .rpc('get_latest_holder_stats');
    
    if (holderStatsError) {
      throw new Error(`Failed to fetch holder stats: ${holderStatsError.message}`);
    }

    console.log("Holder stats from database:", holderStatsData);
    
    // Fetch top holders from the database
    const { data: topHoldersData, error: topHoldersError } = await supabase
      .from('token_holders')
      .select('*')
      .order('rank', { ascending: true })
      .limit(100);
    
    if (topHoldersError) {
      throw new Error(`Failed to fetch top holders: ${topHoldersError.message}`);
    }

    console.log(`Successfully fetched ${topHoldersData?.length || 0} top holders from database`);
    
    // Fetch recent transfers (still using the existing logic since we don't store these in our DB yet)
    const recentTransfers = await fetchTransfers();
    
    // Format the holder stats
    const holderStats = holderStatsData ? {
      currentHolderCount: holderStatsData.total_holders,
      formattedHolderCount: holderStatsData.total_holders.toLocaleString(),
      changes: {
        day: {
          value: holderStatsData.day_change_percent,
          formatted: `+${holderStatsData.day_change_percent.toFixed(1)}%`,
          timestamp: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString()
        },
        week: {
          value: holderStatsData.week_change_percent,
          formatted: `+${holderStatsData.week_change_percent.toFixed(1)}%`,
          timestamp: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        month: {
          value: holderStatsData.month_change_percent,
          formatted: `+${holderStatsData.month_change_percent.toFixed(1)}%`,
          timestamp: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        year: {
          value: holderStatsData.year_change_percent,
          formatted: `+${holderStatsData.year_change_percent.toFixed(1)}%`,
          timestamp: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      lastUpdated: holderStatsData.last_updated
    } : null;

    // Format the top holders
    const topHolders = topHoldersData ? topHoldersData.map(holder => ({
      rank: holder.rank,
      address: holder.address,
      balance: Number(holder.balance),
      formattedBalance: Number(holder.balance).toLocaleString(undefined, {maximumFractionDigits: 2}),
      percentage: holder.percentage.toString(),
      lastChanged: holder.last_updated,
      chain: holder.chain
    })) : [];

    // Construct the response with whatever data we have
    const holderData = {
      holderStats,
      topHolders,
      recentTransfers,
      dailyUpdate: true, // Flag to indicate this is daily updated data
      lastUpdated: holderStatsData?.last_updated || new Date().toISOString()
    };
    
    // Log the response we're about to send for debugging
    console.log("Sending holder data response with available data");
    
    return new Response(JSON.stringify(holderData), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error handling request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch holder data" }),
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

// Function to fetch recent transfers (keeping this as is)
async function fetchTransfers() {
  try {
    const TOKEN_ADDRESSES = {
      bnb: {
        chainId: 56,
        address: "0x680d3113caf77b61b510f332d5ef4cf5b41a761d",
        scannerApiUrl: "https://api.bscscan.com/api",
        scannerUrl: "https://bscscan.com",
        apiKey: Deno.env.get("BSCSCAN_API_KEY") || "",
      },
      base: {
        chainId: 8453,
        address: "0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c", 
        scannerApiUrl: "https://api.basescan.org/api",
        scannerUrl: "https://basescan.org",
        apiKey: Deno.env.get("BASESCAN_API_KEY") || "",
      }
    };

    console.log("Fetching transfers from BscScan");
    // Fetch from BNB Chain (BscScan)
    const bscResponse = await fetch(
      `${TOKEN_ADDRESSES.bnb.scannerApiUrl}?module=account&action=tokentx&contractaddress=${TOKEN_ADDRESSES.bnb.address}&page=1&offset=50&sort=desc&apikey=${TOKEN_ADDRESSES.bnb.apiKey}`
    );
    
    const bscData = await bscResponse.json();
    console.log("BscScan transfers API response:", JSON.stringify(bscData).substring(0, 300) + "...");
    
    const bscTransfers = [];
    if (bscData.status === "1" && Array.isArray(bscData.result)) {
      for (const tx of bscData.result) {
        bscTransfers.push({
          txHash: tx.hash,
          from: tx.from,
          to: tx.to,
          amount: parseInt(tx.value) / (10 ** 18), // Adjust for token decimals
          formattedAmount: (parseInt(tx.value) / (10 ** 18)).toLocaleString(undefined, {maximumFractionDigits: 2}),
          timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
          chain: "BNB Chain",
          scannerUrl: `${TOKEN_ADDRESSES.bnb.scannerUrl}/tx/${tx.hash}`
        });
      }
      console.log(`Successfully fetched ${bscTransfers.length} transfers from BscScan`);
    } else if (bscData.status === "0" && bscData.message) {
      console.log("BscScan transfers API error:", bscData.message);
      // Don't throw here, we can still try to get data from BaseScan
    }
      
    console.log("Fetching transfers from BaseScan");
    // Fetch from Base (BaseScan)
    const baseResponse = await fetch(
      `${TOKEN_ADDRESSES.base.scannerApiUrl}?module=account&action=tokentx&contractaddress=${TOKEN_ADDRESSES.base.address}&page=1&offset=50&sort=desc&apikey=${TOKEN_ADDRESSES.base.apiKey}`
    );
    
    const baseData = await baseResponse.json();
    console.log("BaseScan transfers API response:", JSON.stringify(baseData).substring(0, 300) + "...");
    
    const baseTransfers = [];
    if (baseData.status === "1" && Array.isArray(baseData.result)) {
      for (const tx of baseData.result) {
        baseTransfers.push({
          txHash: tx.hash,
          from: tx.from,
          to: tx.to,
          amount: parseInt(tx.value) / (10 ** 18), // Adjust for token decimals
          formattedAmount: (parseInt(tx.value) / (10 ** 18)).toLocaleString(undefined, {maximumFractionDigits: 2}),
          timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
          chain: "Base",
          scannerUrl: `${TOKEN_ADDRESSES.base.scannerUrl}/tx/${tx.hash}`
        });
      }
      console.log(`Successfully fetched ${baseTransfers.length} transfers from BaseScan`);
    } else if (baseData.status === "0" && baseData.message) {
      console.log("BaseScan transfers API error:", baseData.message);
    }
    
    // If we couldn't get any transfer data, return an empty array
    if (bscTransfers.length === 0 && baseTransfers.length === 0) {
      console.log("No transfer data available from either chain");
      return [];
    }
    
    // Combine and sort by timestamp (newest first)
    const allTransfers = [...bscTransfers, ...baseTransfers];
    
    // Deduplicate transfers by txHash
    const uniqueTransfers = [];
    const seen = new Set();
    
    for (const transfer of allTransfers) {
      const key = `${transfer.txHash}-${transfer.chain}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueTransfers.push(transfer);
      }
    }
    
    // Sort by timestamp, newest first
    uniqueTransfers.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return uniqueTransfers.slice(0, 100); // Return the 100 most recent transfers
  } catch (error) {
    console.error("Error fetching transfers:", error);
    return []; // Return an empty array if there's an error
  }
}

// Serve the function
serve(handleRequest);
