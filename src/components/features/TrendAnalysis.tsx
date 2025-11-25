import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import type { FuturePair } from '../../lib/types';
import { cn } from '../../lib/utils';

interface TrendAnalysisProps {
    pair: FuturePair;
}

export function TrendAnalysis({ pair }: TrendAnalysisProps) {
    const data = [
        { subject: 'Yield', A: pair.factors.yieldScore, fullMark: 100 },
        { subject: 'GDP', A: pair.factors.gdpScore, fullMark: 100 },
        { subject: 'COT', A: pair.factors.cotScore, fullMark: 100 },
        { subject: 'Tech', A: pair.factors.techScore, fullMark: 100 },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-heading font-semibold text-foreground">Trend Composition</h3>
                <div className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                    Score: <span className="text-primary font-bold">{pair.trendScore}/100</span>
                </div>
            </div>

            <div className="flex-1 min-h-[300px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name={pair.symbol}
                            dataKey="A"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="#3b82f6"
                            fillOpacity={0.3}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <FactorCard label="Yield Diff" value={pair.factors.yieldScore} desc="Interest Rate Delta" />
                <FactorCard label="GDP Growth" value={pair.factors.gdpScore} desc="Economic Strength" />
                <FactorCard label="COT Net" value={pair.factors.cotScore} desc="Institutional Flows" />
                <FactorCard label="Technicals" value={pair.factors.techScore} desc="Momentum (RSI/MACD)" />
            </div>
        </div>
    );
}

function FactorCard({ label, value, desc }: { label: string, value: number, desc: string }) {
    return (
        <div className="bg-secondary/20 p-3 rounded border border-white/5">
            <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <span className={cn("text-xs font-bold", value > 50 ? "text-trade-up" : "text-trade-down")}>
                    {value}
                </span>
            </div>
            <div className="text-[10px] text-muted-foreground/60">{desc}</div>
            <div className="h-1 w-full bg-secondary mt-2 rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full", value > 50 ? "bg-trade-up" : "bg-trade-down")}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

// Helper for conditional classes
// import { cn } from '../../lib/utils';
