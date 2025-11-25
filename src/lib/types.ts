export interface TrendFactors {
    yieldScore: number; // 0-100
    gdpScore: number;   // 0-100
    cotScore: number;   // 0-100
    techScore: number;  // 0-100
}

export interface MarketData {
    price: number;
    changePercent: number;
    volume: number;
    high: number;
    low: number;
}

export interface FuturePair {
    id: string;
    symbol: string; // e.g., "EUR/USD"
    name: string;   // e.g., "Euro"
    icon: string;   // URL or component key
    marketData: MarketData;
    trendScore: number; // 0-100, weighted average of factors
    factors: TrendFactors;
    description: string;
}

export type TimeFrame = '1W' | '1M' | '3M' | '1Y' | 'ALL';
