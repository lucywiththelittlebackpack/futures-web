import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, type IChartApi, CandlestickSeries } from 'lightweight-charts';
import type { FuturePair } from '../../lib/types';
import { fetchCandleData } from '../../lib/data-service';

interface CandleChartProps {
    pair: FuturePair;
}

export function CandleChart({ pair }: CandleChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#94a3b8',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
        });

        chartRef.current = chart;

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#10B981',
            downColor: '#EF4444',
            borderVisible: false,
            wickUpColor: '#10B981',
            wickDownColor: '#EF4444',
        });

        const loadData = async () => {
            setLoading(true);
            const data = await fetchCandleData(pair.symbol);
            candlestickSeries.setData(data);
            chart.timeScale().fitContent();
            setLoading(false);
        };

        loadData();

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [pair.symbol]);

    return (
        <div className="h-full w-full relative">
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-xl font-heading font-bold text-foreground">{pair.name} ({pair.symbol})</h3>
                <p className="text-sm text-muted-foreground">Weekly Candles • 2 Year History</p>
            </div>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20 backdrop-blur-sm">
                    <div className="text-primary font-medium animate-pulse">Loading Data...</div>
                </div>
            )}
            <div ref={chartContainerRef} className="w-full h-full" />
        </div>
    );
}
