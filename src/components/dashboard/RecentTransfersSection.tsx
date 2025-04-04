
import React, { useState } from 'react';
import { CombinedTokenData } from '@/services/tokenAPIService';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeftRight, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RecentTransfersSectionProps {
  tokenInfo: CombinedTokenData | undefined;
  isLoading: boolean;
}

const RecentTransfersSection: React.FC<RecentTransfersSectionProps> = ({
  tokenInfo,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(10);
  
  if (isLoading || !tokenInfo?.holderData?.recentTransfers) {
    return <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <ArrowLeftRight size={20} className="text-indigo-400" />
          <Skeleton className="h-8 w-48" />
        </h2>
        <Card className="bg-dehub-card border-dehub-card-border">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>;
  }
  
  const recentTransfers = tokenInfo?.holderData?.recentTransfers || [];
  if (recentTransfers.length === 0) {
    return <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <ArrowLeftRight size={20} className="text-indigo-400" />
          Recent Transfers
        </h2>
        <Card className="bg-dehub-card border-dehub-card-border">
          <CardContent className="py-8 text-center">
            <p className="text-white opacity-60">No transfer data available at this time.</p>
          </CardContent>
        </Card>
      </div>;
  }

  // Filter by search query if provided
  const filteredTransfers = searchQuery 
    ? recentTransfers.filter(tx => 
        tx.from.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tx.to.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tx.txHash.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : recentTransfers;

  // Show only the first N transfers depending on the current display count
  const displayedTransfers = filteredTransfers.slice(0, displayCount);
  
  const loadMore = () => {
    setDisplayCount(prevCount => Math.min(prevCount + 10, 100));
  };
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const formatTxHash = (hash: string) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };
  
  return <>
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <ArrowLeftRight size={20} className="text-indigo-400" />
        Recent Transfers
      </h2>
      
      <Card className="bg-dehub-card border-dehub-card-border mb-8">
        <CardHeader>
          <div className="mt-4">
            <Input 
              placeholder="Search by address or tx hash..." 
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
                  <TableHead className="text-white">Transaction</TableHead>
                  <TableHead className="text-white">Time</TableHead>
                  <TableHead className="text-white">From</TableHead>
                  <TableHead className="text-white">To</TableHead>
                  <TableHead className="text-white text-right">Amount</TableHead>
                  <TableHead className="text-white">Chain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedTransfers.map((tx, index) => <TableRow key={`${tx.txHash}-${tx.chain}`} className="border-b border-white/10">
                    <TableCell className="text-white">
                      <a href={tx.scannerUrl} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-indigo-400">
                        <span className="font-mono">{formatTxHash(tx.txHash)}</span>
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </TableCell>
                    <TableCell className="text-white">{formatTime(tx.timestamp)}</TableCell>
                    <TableCell className="text-white">
                      <span className="font-mono">{formatAddress(tx.from)}</span>
                    </TableCell>
                    <TableCell className="text-white">
                      <span className="font-mono">{formatAddress(tx.to)}</span>
                    </TableCell>
                    <TableCell className="text-white text-right">{tx.formattedAmount}</TableCell>
                    <TableCell className="text-white">{tx.chain}</TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>
          
          {displayCount < filteredTransfers.length && <div className="mt-4 text-center">
              <Button onClick={loadMore} variant="outline" className="border-dehub-border text-white hover:bg-indigo-700">
                Load More
              </Button>
            </div>}
        </CardContent>
      </Card>
    </>;
};

export default RecentTransfersSection;
