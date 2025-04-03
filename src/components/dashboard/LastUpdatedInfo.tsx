
import React from 'react';
import { Clock } from 'lucide-react';

interface LastUpdatedInfoProps {
  timestamp: string | undefined;
  isLoading: boolean;
}

const LastUpdatedInfo: React.FC<LastUpdatedInfoProps> = ({ 
  timestamp, 
  isLoading 
}) => {
  const formattedTime = timestamp 
    ? new Date(timestamp).toLocaleString() 
    : 'Unknown';

  return (
    <div className="mt-8 text-center">
      <p className="text-sm text-slate-400 flex items-center justify-center gap-1">
        <Clock size={14} className="text-slate-500" />
        Last updated: {isLoading ? 'Loading...' : formattedTime}
      </p>
    </div>
  );
};

export default LastUpdatedInfo;
