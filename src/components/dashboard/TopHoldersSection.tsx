
import React, { useState } from 'react';
import { CombinedTokenData } from '@/services/tokenAPIService';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TopHoldersSectionProps {
  tokenInfo: CombinedTokenData | undefined;
  isLoading: boolean;
}

const TopHoldersSection: React.FC<TopHoldersSectionProps> = ({
  tokenInfo,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(10);
  
  // Always show loading state if data is loading or if topHolders is undefined
  if (isLoading || !tokenInfo?.holderData?.topHolders) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <Shield size={20} className="text-indigo-400" />
          <span>Top Holders</span>
        </h2>
        <Card className="bg-dehub-card border-dehub-card-border">
          <CardHeader>
            <div className="mt-4">
              <Skeleton className="h-10 w-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white/10">
                    <TableHead className="text-white">Rank</TableHead>
                    <TableHead className="text-white">Address</TableHead>
                    <TableHead className="text-white text-right">Balance</TableHead>
                    <TableHead className="text-white text-right">Percentage</TableHead>
                    <TableHead className="text-white">Chain</TableHead>
                    <TableHead className="text-white">Last Changed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(10)].map((_, index) => (
                    <TableRow key={index} className="border-b border-white/10">
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const topHolders = tokenInfo.holderData.topHolders;
  const isDailyUpdate = tokenInfo.holderData.dailyUpdate === true;
  
  // If we have no holders data at all, show a message
  if (topHolders.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <Shield size={20} className="text-indigo-400" />
          Top Holders
        </h2>
        <Card className="bg-dehub-card border-dehub-card-border">
          <CardContent className="py-8 text-center">
            <p className="text-white opacity-60">No holder data available at this time.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter by search query if provided
  const filteredHolders = searchQuery 
    ? topHolders.filter(holder => holder.address.toLowerCase().includes(searchQuery.toLowerCase())) 
    : topHolders;

  // Show only the first N holders depending on the current display count
  const displayedHolders = filteredHolders.slice(0, displayCount);
  
  const loadMore = () => {
    setDisplayCount(prevCount => Math.min(prevCount + 10, 100));
  };
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Get the chain badge color
  const getChainBadgeColor = (chain: string) => {
    if (chain === 'BNB Chain') return 'bg-yellow-600 hover:bg-yellow-700';
    if (chain === 'Base') return 'bg-blue-600 hover:bg-blue-700';
    return 'bg-gray-600 hover:bg-gray-700';
  };
  
  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <Shield size={20} className="text-indigo-400" />
        Top Holders
        {isDailyUpdate && (
          <span className="text-xs font-normal bg-indigo-500/20 px-2 py-1 rounded-full flex items-center gap-1">
            <RefreshCw size={12} className="text-indigo-400" />
            Updated daily
          </span>
        )}
      </h2>
      
      <Card className="bg-dehub-card border-dehub-card-border mb-8">
        <CardHeader>
          <div className="mt-4">
            <Input 
              placeholder="Search by address..." 
              className="bg-dehub-input border-dehub-border text-white" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10">
                  <TableHead className="text-white">Rank</TableHead>
                  <TableHead className="text-white">Address</TableHead>
                  <TableHead className="text-white text-right">Balance</TableHead>
                  <TableHead className="text-white text-right">Percentage</TableHead>
                  <TableHead className="text-white">Chain</TableHead>
                  <TableHead className="text-white">Last Changed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedHolders.map(holder => (
                  <TableRow key={holder.address} className="border-b border-white/10">
                    <TableCell className="text-white">{holder.rank}</TableCell>
                    <TableCell className="text-white">
                      <span className="font-mono">{formatAddress(holder.address)}</span>
                    </TableCell>
                    <TableCell className="text-white text-right">{holder.formattedBalance}</TableCell>
                    <TableCell className="text-white text-right">{holder.percentage}%</TableCell>
                    <TableCell className="text-white">
                      {holder.chain && (
                        <Badge className={getChainBadgeColor(holder.chain)}>
                          {holder.chain}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-white">
                      {new Date(holder.lastChanged).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {displayCount < filteredHolders.length && (
            <div className="mt-4 text-center">
              <Button 
                onClick={loadMore} 
                variant="outline" 
                className="border-dehub-border text-white hover:bg-indigo-700"
              >
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TopHoldersSection;
