
import React from 'react';
import { ExternalLink } from 'lucide-react';

const CoinGeckoLink = () => {
  return (
    <a 
      href="https://www.coingecko.com/en/coins/dehub" 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mt-1"
    >
      <span>View full chart on CoinGecko</span>
      <ExternalLink className="ml-1 h-3 w-3" />
    </a>
  );
};

export default CoinGeckoLink;
