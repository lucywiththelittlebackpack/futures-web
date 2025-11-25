import type { TrendFactors } from './types';

/**
 * Calculates the overall Trend Score (0-100) based on 4 weighted factors.
 * 
 * Weights:
 * 1. Yield Differential (30%): Higher yield relative to USD is bullish.
 * 2. GDP Growth (20%): Stronger growth relative to USD is bullish.
 * 3. COT Positioning (25%): Net Long positioning by institutions is bullish.
 * 4. Technicals (25%): RSI/MACD trend.
 */
export function calculateTrendScore(factors: TrendFactors): number {
    const { yieldScore, gdpScore, cotScore, techScore } = factors;

    // Weights
    const wYield = 0.30;
    const wGDP = 0.20;
    const wCOT = 0.25;
    const wTech = 0.25;

    const score = (
        (yieldScore * wYield) +
        (gdpScore * wGDP) +
        (cotScore * wCOT) +
        (techScore * wTech)
    );

    return Math.round(score);
}

/**
 * Helper to normalize raw values into a 0-100 score.
 * @param value Raw value (e.g., yield diff %)
 * @param min Minimum expected value (e.g., -5%)
 * @param max Maximum expected value (e.g., +5%)
 */
export function normalizeScore(value: number, min: number, max: number): number {
    const clamped = Math.max(min, Math.min(max, value));
    // Map [min, max] to [0, 100]
    return ((clamped - min) / (max - min)) * 100;
}

export function getTrendLabel(score: number): { label: string; color: string } {
    if (score >= 80) return { label: 'Strong Buy', color: 'text-trade-up' };
    if (score >= 60) return { label: 'Buy', color: 'text-trade-up' };
    if (score <= 20) return { label: 'Strong Sell', color: 'text-trade-down' };
    if (score <= 40) return { label: 'Sell', color: 'text-trade-down' };
    return { label: 'Neutral', color: 'text-trade-neutral' };
}
