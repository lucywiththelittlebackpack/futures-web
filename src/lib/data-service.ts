import type { FuturePair, TrendFactors } from './types';
import { calculateTrendScore, normalizeScore } from './trend-logic';

// Feature Flag for Real Data
const USE_REAL_DATA = true;

// Base USD metrics for comparison
const USD_YIELD = 5.25; // Fed Funds Rate
const USD_GDP = 2.5;    // US GDP Growth

// CME Group FX Futures Symbols (Yahoo Finance Tickers)
const CURRENCIES = [
    { id: 'EUR', name: 'Euro', symbol: '6E=F', yield: 4.0, gdp: 0.8, cot: 15000, rsi: 45 },
    { id: 'GBP', name: 'British Pound', symbol: '6B=F', yield: 5.25, gdp: 0.5, cot: -5000, rsi: 55 },
    { id: 'JPY', name: 'Japanese Yen', symbol: '6J=F', yield: -0.1, gdp: 1.2, cot: -80000, rsi: 30 },
    { id: 'AUD', name: 'Australian Dollar', symbol: '6A=F', yield: 4.35, gdp: 1.5, cot: 2000, rsi: 60 },
    { id: 'CAD', name: 'Canadian Dollar', symbol: '6C=F', yield: 5.0, gdp: 1.1, cot: -1000, rsi: 48 },
    { id: 'CHF', name: 'Swiss Franc', symbol: '6S=F', yield: 1.75, gdp: 0.9, cot: 5000, rsi: 52 },
    { id: 'NZD', name: 'New Zealand Dollar', symbol: '6N=F', yield: 5.5, gdp: 1.8, cot: 1200, rsi: 58 },
    { id: 'MXN', name: 'Mexican Peso', symbol: '6M=F', yield: 11.25, gdp: 3.2, cot: 25000, rsi: 75 },
    { id: 'BRL', name: 'Brazilian Real', symbol: '6L=F', yield: 10.75, gdp: 2.9, cot: 8000, rsi: 65 },
    { id: 'ZAR', name: 'South African Rand', symbol: '6Z=F', yield: 8.25, gdp: 0.6, cot: -3000, rsi: 42 },
];

function generateMockFactors(currency: typeof CURRENCIES[0]): TrendFactors {
    // 1. Yield Score: Compare to USD. Higher is better.
    // Range: -6% to +6% diff -> 0-100
    const yieldDiff = currency.yield - USD_YIELD;
    const yieldScore = normalizeScore(yieldDiff, -6, 6);

    // 2. GDP Score: Compare to USD. Higher is better.
    // Range: -3% to +3% diff -> 0-100
    const gdpDiff = currency.gdp - USD_GDP;
    const gdpScore = normalizeScore(gdpDiff, -3, 3);

    // 3. COT Score: Net positioning.
    // Range: -100k to +100k -> 0-100
    const cotScore = normalizeScore(currency.cot, -100000, 100000);

    // 4. Technical Score: Based on RSI (simplified).
    // RSI 30=Oversold (Bullish reversal potential?), RSI 70=Overbought.
    // For trend following: RSI > 50 is bullish, < 50 is bearish.
    // Let's map RSI 0-100 directly to Score 0-100 for simplicity of "momentum".
    const techScore = currency.rsi;

    return { yieldScore, gdpScore, cotScore, techScore };
}

export function getFuturesData(): FuturePair[] {
    return CURRENCIES.map(c => {
        const factors = generateMockFactors(c);
        const trendScore = calculateTrendScore(factors);

        // Mock Price Data (Fallback)
        const basePrice = c.id === 'JPY' ? 0.0065 : c.id === 'MXN' ? 0.058 : 1.05;
        const volatility = (Math.random() * 2 - 1) * 0.01; // +/- 1%
        const currentPrice = basePrice * (1 + volatility);

        return {
            id: c.id,
            symbol: c.symbol,
            name: c.name,
            icon: `https://flagcdn.com/w40/${c.id.slice(0, 2).toLowerCase()}.png`, // Simple flag logic
            marketData: {
                price: currentPrice,
                changePercent: volatility * 100,
                volume: Math.floor(Math.random() * 100000) + 50000,
                high: currentPrice * 1.005,
                low: currentPrice * 0.995,
            },
            trendScore,
            factors,
            description: `${c.name} Futures Contract`
        };
    }).sort((a, b) => b.trendScore - a.trendScore); // Sort by strongest trend
}

export async function fetchCandleData(symbol: string) {
    if (!USE_REAL_DATA) {
        return generateHistory(1.05, 90);
    }

    try {
        // Yahoo Finance Chart API (Unofficial but widely used for demos)
        // Interval: 1wk (Weekly), Range: 2y (2 Years)
        const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1wk&range=2y`
        );

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const result = data.chart.result[0];
        const quote = result.indicators.quote[0];
        const timestamps = result.timestamp;

        return timestamps.map((t: number, i: number) => ({
            time: new Date(t * 1000).toISOString().split('T')[0],
            open: quote.open[i],
            high: quote.high[i],
            low: quote.low[i],
            close: quote.close[i],
            volume: quote.volume[i]
        })).filter((c: any) => c.open && c.close); // Filter incomplete candles

    } catch (error) {
        console.warn(`Failed to fetch real data for ${symbol}, falling back to mock.`, error);
        return generateHistory(1.05, 90);
    }
}

export function generateHistory(basePrice: number, days: number = 90) {
    const data = [];
    let price = basePrice;
    const now = new Date();

    // Generate weekly candles for mock
    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 7)); // Weekly intervals

        const volatility = 0.02;
        const open = price;
        const close = price * (1 + (Math.random() * volatility * 2 - volatility));
        const high = Math.max(open, close) * (1 + Math.random() * 0.005);
        const low = Math.min(open, close) * (1 - Math.random() * 0.005);

        price = close;

        data.push({
            time: date.toISOString().split('T')[0],
            open,
            high,
            low,
            close,
            volume: Math.floor(Math.random() * 50000) + 10000,
        });
    }
    return data;
}
