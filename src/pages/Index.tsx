
import React, { Suspense } from 'react';
import TokenDashboard from '@/components/TokenDashboard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Header from '@/components/Header';

const Index = () => {
  // Set the document title to match SEO
  React.useEffect(() => {
    document.title = "DHBscan - Cross chain data for DeHub";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dehub-background to-black font-exo">
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <TokenDashboard />
      </Suspense>
    </div>
  );
};

export default Index;
