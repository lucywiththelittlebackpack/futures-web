import { useState, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, Settings, Bell } from 'lucide-react';
import { FutureCard } from '../features/FutureCard';
import { getFuturesData } from '../../lib/data-service';
import type { FuturePair } from '../../lib/types';

interface SidebarProps {
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export function Sidebar({ selectedId, onSelect }: SidebarProps) {
    const [futures, setFutures] = useState<FuturePair[]>([]);

    useEffect(() => {
        setFutures(getFuturesData());
    }, []);

    return (
        <div className="w-80 border-r border-border bg-card/30 backdrop-blur-xl flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-border/50">
                <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                    FutureTrend
                </h1>
                <p className="text-xs text-muted-foreground mt-1">Institutional Grade Analytics</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Market Watch</div>
                {futures.map(pair => (
                    <FutureCard
                        key={pair.id}
                        pair={pair}
                        isSelected={selectedId === pair.id}
                        onClick={() => onSelect(pair.id)}
                    />
                ))}
            </div>

            <div className="p-4 border-t border-border/50 space-y-1">
                <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-secondary/50 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                    <LayoutDashboard size={18} />
                    Dashboard
                </button>
                <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-secondary/50 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                    <TrendingUp size={18} />
                    Analysis
                </button>
                <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-secondary/50 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                    <Bell size={18} />
                    Alerts
                </button>
                <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-secondary/50 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                    <Settings size={18} />
                    Settings
                </button>
            </div>
        </div>
    );
}
