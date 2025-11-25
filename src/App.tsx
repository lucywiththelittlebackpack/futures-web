import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from './components/layout/AppLayout';
import { TrendAnalysis } from './components/features/TrendAnalysis';
import { CandleChart } from './components/features/CandleChart';
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
      <div className="p-4 h-full flex flex-col">
        {selectedPair ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
            {/* Main Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 rounded-xl glass-card border border-white/5 p-4 flex flex-col overflow-hidden"
            >
              <CandleChart pair={selectedPair} />
            </motion.div>

            {/* Trend Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl glass-card border border-white/5 p-4 flex flex-col"
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
