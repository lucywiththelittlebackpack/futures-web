import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { FuturePair } from '../../lib/types';
import { generateHistory } from '../../lib/data-service';

interface PriceChartProps {
    pair: FuturePair;
}

export function PriceChart({ pair }: PriceChartProps) {
    const data = useMemo(() => {
        return generateHistory(pair.marketData.price, 90); // 90 days history
    }, [pair.id]); // Re-generate only when pair changes

    const isPositive = pair.trendScore > 50;
    const color = isPositive ? '#10B981' : '#EF4444'; // Emerald or Red

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-heading font-semibold">Price Action</h3>
                    <p className="text-xs text-muted-foreground">Daily timeframe • 3 Months</p>
                </div>
                <div className="flex gap-2">
                    {['1W', '1M', '3M', '1Y'].map((tf) => (
                        <button
                            key={tf}
                            className={`text-xs px-3 py-1 rounded-md transition-colors ${tf === '3M' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary text-muted-foreground'}`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10 }}
                            minTickGap={30}
                            tickFormatter={(str) => {
                                const date = new Date(str);
                                return `${date.getMonth() + 1}/${date.getDate()}`;
                            }}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10 }}
                            tickFormatter={(val) => val.toFixed(4)}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                            formatter={(val: number) => [val.toFixed(4), 'Price']}
                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke={color}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
