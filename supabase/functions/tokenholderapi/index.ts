
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

// Define CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, ApiKey",
  "Access-Control-Max-Age": "86400",
};

// Token contract addresses on different chains
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

// Generate mock holder data for development (will be replaced with real API calls)
function generateMockHolderData() {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  
  // A base number of holders with some random fluctuation
  const currentHolders = 12500 + Math.floor(Math.random() * 500);
  const dayChange = (Math.random() * 10) - 4; // Between -4% and +6%
  const weekChange = (Math.random() * 18) - 5; // Between -5% and +13%
  const monthChange = (Math.random() * 25) - 8; // Between -8% and +17%
  const yearChange = (Math.random() * 60) - 20; // Between -20% and +40%
  
  // Generate top holders data
  const topHolders = Array.from({ length: 100 }, (_, i) => {
    const balance = Math.floor(1000000000 * Math.pow(0.93, i) * (1 + Math.random() * 0.2));
    return {
      rank: i + 1,
      address: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      balance: balance,
      formattedBalance: balance.toLocaleString(),
      percentage: (balance / 8000000000 * 100).toFixed(4),
      lastChanged: new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
  
  // Generate recent transfers
  const recentTransfers = Array.from({ length: 100 }, (_, i) => {
    const amount = Math.floor(10000 * (1 + Math.random() * 990));
    const timestamp = new Date(now.getTime() - i * Math.random() * 60 * 60 * 1000).toISOString();
    const isDeposit = Math.random() > 0.5;
    return {
      txHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      from: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      to: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      amount: amount,
      formattedAmount: amount.toLocaleString(),
      timestamp: timestamp,
      chain: Math.random() > 0.5 ? "BNB Chain" : "Base",
      scannerUrl: Math.random() > 0.5 
        ? `${TOKEN_ADDRESSES.bnb.scannerUrl}/tx/0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
        : `${TOKEN_ADDRESSES.base.scannerUrl}/tx/0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };
  });
  
  return {
    holderStats: {
      currentHolderCount: currentHolders,
      formattedHolderCount: currentHolders.toLocaleString(),
      changes: {
        day: {
          value: dayChange,
          formatted: `${dayChange > 0 ? '+' : ''}${dayChange.toFixed(2)}%`,
          timestamp: oneDayAgo.toISOString()
        },
        week: {
          value: weekChange,
          formatted: `${weekChange > 0 ? '+' : ''}${weekChange.toFixed(2)}%`,
          timestamp: oneWeekAgo.toISOString()
        },
        month: {
          value: monthChange,
          formatted: `${monthChange > 0 ? '+' : ''}${monthChange.toFixed(2)}%`,
          timestamp: oneMonthAgo.toISOString()
        },
        year: {
          value: yearChange,
          formatted: `${yearChange > 0 ? '+' : ''}${yearChange.toFixed(2)}%`,
          timestamp: oneYearAgo.toISOString()
        }
      },
      lastUpdated: now.toISOString()
    },
    topHolders: topHolders,
    recentTransfers: recentTransfers
  };
}

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
    // For now, we generate mock data
    // In a production environment, we'd actually fetch this data from blockchain scanners
    const holderData = generateMockHolderData();
    
    // Log the response we're about to send for debugging
    console.log("Sending holder data response");
    
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

// Serve the function
serve(handleRequest);
