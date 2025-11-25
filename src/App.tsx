import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from './components/layout/AppLayout';
import { TrendAnalysis } from './components/features/TrendAnalysis';
import { PriceChart } from './components/features/PriceChart';
import { getFuturesData } from './lib/data-service';
import type { FuturePair } from './lib/types';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [futures, setFutures] = useState<FuturePair[]>([]);

  useEffect(() => {
    const data = getFuturesData();
    setFutures(data);
    if (data.length > 0 && !selectedId) {
      setSelectedId(data[0].id);
    }
  }, []);

  const selectedPair = futures.find(f => f.id === selectedId);

  return (
    <AppLayout selectedId={selectedId} onSelect={setSelectedId}>
      <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex-shrink-0"
        >
          <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Market Overview
          </h2>
          <p className="text-muted-foreground mt-2">
            Weekly trend analysis based on institutional flows and macro data.
          </p>
        </motion.header>

        {selectedPair ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* Main Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 rounded-xl glass-card border border-white/5 p-6 flex flex-col"
            >
              <PriceChart pair={selectedPair} />
            </motion.div>

            {/* Trend Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl glass-card border border-white/5 p-6 flex flex-col"
            >
              <TrendAnalysis pair={selectedPair} />
            </motion.div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Loading market data...
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default App;
