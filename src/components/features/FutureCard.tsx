import type { FuturePair } from '../../lib/types';
import { getTrendLabel } from '../../lib/trend-logic';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface FutureCardProps {
    pair: FuturePair;
    isSelected: boolean;
    onClick: () => void;
}

export function FutureCard({ pair, isSelected, onClick }: FutureCardProps) {
    const { label, color } = getTrendLabel(pair.trendScore);
    const isPositive = pair.marketData.changePercent >= 0;

    return (
        <motion.div
            layoutId={pair.id}
            onClick={onClick}
            className={cn(
                "p-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:bg-secondary/40 group",
                isSelected ? "bg-secondary/60 border-primary/20 shadow-lg shadow-primary/5" : "bg-card/40"
            )}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center overflow-hidden ring-1 ring-white/10">
                        <img src={pair.icon} alt={pair.name} className="w-full h-full object-cover opacity-90" />
                    </div>
                    <div>
                        <div className="font-bold text-sm tracking-wide">{pair.symbol}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{pair.name}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-mono text-sm font-medium">{pair.marketData.price.toFixed(4)}</div>
                    <div className={cn("text-[10px] font-medium", isPositive ? "text-trade-up" : "text-trade-down")}>
                        {isPositive ? '+' : ''}{pair.marketData.changePercent.toFixed(2)}%
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <div className="text-[10px] text-muted-foreground">Trend</div>
                    <div className={cn("text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/5", color)}>
                        {label}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all duration-500",
                                pair.trendScore > 50 ? "bg-trade-up" : "bg-trade-down"
                            )}
                            style={{ width: `${pair.trendScore}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{pair.trendScore}</span>
                </div>
            </div>
        </motion.div>
    );
}
