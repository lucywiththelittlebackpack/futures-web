import { useState, useEffect } from 'react';
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
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {futures.map(pair => (
                    <FutureCard
                        key={pair.id}
                        pair={pair}
                        isSelected={selectedId === pair.id}
                        onClick={() => onSelect(pair.id)}
                    />
                ))}
            </div>
        </div>
    );
}
