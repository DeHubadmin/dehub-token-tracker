
import React, { useState } from 'react';
import { CombinedTokenData } from '@/services/tokenAPIService';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  
  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <Shield size={20} className="text-indigo-400" />
          <Skeleton className="h-8 w-40" />
        </h2>
        <Card className="bg-dehub-card border-dehub-card-border">
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const topHolders = tokenInfo?.holderData?.topHolders || [];
  
  if (topHolders.length === 0) {
    return null;
  }
  
  // Filter by search query if provided
  const filteredHolders = searchQuery 
    ? topHolders.filter(holder => 
        holder.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : topHolders;
  
  // Show only the first N holders depending on the current display count
  const displayedHolders = filteredHolders.slice(0, displayCount);
  
  const loadMore = () => {
    setDisplayCount(prevCount => Math.min(prevCount + 10, 100));
  };
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <Shield size={20} className="text-indigo-400" />
        Top Holders
      </h2>
      
      <Card className="bg-dehub-card border-dehub-card-border mb-8">
        <CardHeader>
          <CardTitle className="text-white">Top {topHolders.length} Token Holders</CardTitle>
          <div className="mt-4">
            <Input 
              placeholder="Search by address..." 
              className="bg-dehub-input border-dehub-border text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  <TableHead className="text-white">Last Changed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedHolders.map((holder) => (
                  <TableRow key={holder.address} className="border-b border-white/10">
                    <TableCell className="text-white">{holder.rank}</TableCell>
                    <TableCell className="text-white">
                      <span className="font-mono">{formatAddress(holder.address)}</span>
                    </TableCell>
                    <TableCell className="text-white text-right">{holder.formattedBalance}</TableCell>
                    <TableCell className="text-white text-right">{holder.percentage}%</TableCell>
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
