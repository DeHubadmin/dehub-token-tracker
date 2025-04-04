
import { formatPrice } from "./formatters.ts";

// Function to fetch market data from CoinGecko
export async function fetchMarketData() {
  // First fetch current market data
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
  
  // Update with correct all-time high and low values
  const allTimeHigh = 0.09015; // Updated to match the chart
  const allTimeLow = 0.00009;
  
  // Calculate percentage changes correctly
  const changeFromATH = ((tokenData.current_price - allTimeHigh) / allTimeHigh) * 100;
  
  // Calculate all-time percentage change from initial price to current price
  // This represents the change from all-time low to current price
  const allTimePercentageChange = ((tokenData.current_price - allTimeLow) / allTimeLow) * 100;
  
  // Calculate the multiples needed to reach ATH from current price
  const multiplesToATH = allTimeHigh / tokenData.current_price;
  
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
    priceChangePercentageAllTime: allTimePercentageChange,
    priceChangePercentageFromATH: changeFromATH,
    multiplesToATH: multiplesToATH,
    allTimeHigh: allTimeHigh,
    formattedAllTimeHigh: formatPrice(allTimeHigh),
    allTimeLow: allTimeLow,
    formattedAllTimeLow: formatPrice(allTimeLow),
    high24h: tokenData.high_24h,
    low24h: tokenData.low_24h,
    lastUpdated: tokenData.last_updated
  };
}

// Function to fetch historical price data
export async function fetchHistoricalPriceData() {
  try {
    // Fetch from CoinGecko API with daily data from Jan 1, 2021
    const startDate = new Date('2021-01-01').getTime() / 1000;
    const endDate = Math.floor(Date.now() / 1000);
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/dehub/market_chart/range?vs_currency=usd&from=${startDate}&to=${endDate}`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.prices || !Array.isArray(data.prices) || data.prices.length === 0) {
      throw new Error("No historical price data returned from CoinGecko");
    }
    
    // Format the data for the chart
    return data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp),
      price: price
    }));
  } catch (error) {
    console.error("Error fetching historical price data:", error);
    return null;
  }
}
