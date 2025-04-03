
import { formatPrice } from "./formatters.ts";

// Function to fetch market data from CoinGecko
export async function fetchMarketData() {
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
  
  // Update with correct all-time high value
  const allTimeHigh = 0.065;
  const allTimeLow = 0.00008;
  const changeFromATH = ((tokenData.current_price - allTimeHigh) / allTimeHigh) * 100;
  
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
    priceChangePercentageAllTime: 156.75, // Hard to get from API, keeping this hard-coded
    priceChangePercentageFromATH: changeFromATH,
    allTimeHigh: allTimeHigh,
    formattedAllTimeHigh: formatPrice(allTimeHigh),
    allTimeLow: allTimeLow,
    formattedAllTimeLow: formatPrice(allTimeLow),
    high24h: tokenData.high_24h,
    low24h: tokenData.low_24h,
    lastUpdated: tokenData.last_updated
  };
}
