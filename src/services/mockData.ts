
// Mock data to use when API calls fail
export const mockTokenData = {
  name: "DeHub",
  symbol: "DHB",
  supplyMetrics: {
    totalSupply: {
      value: 8000000000,
      formatted: "8,000,000,000",
      description: "Total tokens across all supported chains"
    },
    circulatingSupply: {
      value: 2400000000,
      formatted: "2,400,000,000",
      description: "Tokens available in the market"
    },
    maxSupply: {
      value: 8000000000,
      formatted: "8,000,000,000",
      description: "Maximum possible token supply"
    },
    lastUpdated: new Date().toISOString()
  },
  chainBreakdown: {
    chains: [
      {
        name: "BNB Chain",
        chainId: 56,
        tokenAddress: "0x680d3113caf77b61b510f332d5ef4cf5b41a761d",
        supply: {
          value: 1400000000,
          formatted: "1,400,000,000",
          percentage: 58.33
        },
        scannerUrl: "https://bscscan.com/token/0x680d3113caf77b61b510f332d5ef4cf5b41a761d"
      },
      {
        name: "Base",
        chainId: 8453,
        tokenAddress: "0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c",
        supply: {
          value: 1000000000,
          formatted: "1,000,000,000",
          percentage: 41.67
        },
        scannerUrl: "https://basescan.org/token/0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c"
      }
    ],
    totalSupplyAcrossChains: {
      value: 2400000000,
      formatted: "2,400,000,000"
    },
    lastUpdated: new Date().toISOString()
  },
  holderData: {
    holderStats: {
      currentHolderCount: 57934,
      formattedHolderCount: "57,934",
      changes: {
        day: {
          value: 2.6,
          formatted: "+2.6%",
          timestamp: new Date().toISOString()
        },
        week: {
          value: 5.8,
          formatted: "+5.8%",
          timestamp: new Date().toISOString()
        },
        month: {
          value: 12.4,
          formatted: "+12.4%",
          timestamp: new Date().toISOString()
        },
        year: {
          value: 52.5,
          formatted: "+52.5%",
          timestamp: new Date().toISOString()
        }
      },
      lastUpdated: new Date().toISOString()
    },
    topHolders: [
      {
        rank: 1,
        address: "0x1234567890abcdef1234567890abcdef12345678",
        balance: 240000000,
        formattedBalance: "240,000,000",
        percentage: "10.0%",
        lastChanged: new Date().toISOString(),
        chain: "BNB Chain"
      },
      {
        rank: 2,
        address: "0xabcdef1234567890abcdef1234567890abcdef12",
        balance: 180000000,
        formattedBalance: "180,000,000",
        percentage: "7.5%",
        lastChanged: new Date().toISOString(),
        chain: "Base"
      },
      {
        rank: 3,
        address: "0x7890abcdef1234567890abcdef1234567890abcd",
        balance: 120000000,
        formattedBalance: "120,000,000",
        percentage: "5.0%",
        lastChanged: new Date().toISOString(),
        chain: "BNB Chain"
      }
    ],
    recentTransfers: [
      {
        txHash: "0xabc123def456789abcdef123456789abcdef123456789abcdef123456789abcd",
        from: "0x1234567890abcdef1234567890abcdef12345678",
        to: "0xabcdef1234567890abcdef1234567890abcdef12",
        amount: 5000000,
        formattedAmount: "5,000,000",
        timestamp: new Date().toISOString(),
        chain: "BNB Chain",
        scannerUrl: "https://bscscan.com/tx/0xabc123def456789abcdef123456789abcdef123456789abcdef123456789abcd"
      },
      {
        txHash: "0xdef456789abcdef123456789abcdef123456789abcdef123456789abcdef1234",
        from: "0xabcdef1234567890abcdef1234567890abcdef12",
        to: "0x7890abcdef1234567890abcdef1234567890abcd",
        amount: 3000000,
        formattedAmount: "3,000,000",
        timestamp: new Date().toISOString(),
        chain: "Base",
        scannerUrl: "https://basescan.org/tx/0xdef456789abcdef123456789abcdef123456789abcdef123456789abcdef1234"
      }
    ],
    lastUpdated: new Date().toISOString()
  },
  marketData: {
    price: 0.001234,
    formattedPrice: "$0.001234",
    marketCap: 2961600,
    formattedMarketCap: "$2,961,600",
    totalVolume: 258420,
    formattedTotalVolume: "$258,420",
    priceChangePercentage1h: 0.5,
    priceChangePercentage24h: 2.3,
    priceChangePercentage7d: 12.1,
    priceChangePercentage14d: 18.5,
    priceChangePercentage30d: 25.7,
    priceChangePercentage1y: 95.2,
    priceChangePercentageAllTime: 150.0,
    priceChangePercentageFromATH: -25.3,
    multiplesToATH: 1.34,
    allTimeHigh: 0.001654,
    formattedAllTimeHigh: "$0.001654",
    allTimeLow: 0.000498,
    formattedAllTimeLow: "$0.000498",
    high24h: 0.001287,
    formattedHigh24h: "$0.001287",
    low24h: 0.001187,
    formattedLow24h: "$0.001187",
    lastUpdated: new Date().toISOString()
  }
};
