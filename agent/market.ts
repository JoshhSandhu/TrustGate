// HARDCODED FOR DEMO - Two scenarios

export interface MarketOpportunity {
  marketId: string;
  title: string;
  confidence: number;
  requiredUsdc: number;
  chain: string;
}

/**
 * Market A: ETH to $5k
 * Result: REFUSE (exceeds $50 limit)
 */
export const MARKET_A: MarketOpportunity = {
  marketId: 'polymarket/will-eth-hit-5k',
  title: 'Will ETH hit $5000 by March 2026?',
  confidence: 85, // High confidence (above 70%)
  requiredUsdc: 75, // EXCEEDS $50 limit → REFUSE
  chain: 'eth-sepolia',
};

/**
 * Market B: BTC to $100k
 * Result: EXECUTE (within limits)
 */
export const MARKET_B: MarketOpportunity = {
  marketId: 'polymarket/will-btc-hit-100k',
  title: 'Will BTC hit $100k by April 2026?',
  confidence: 80, // Above 70% threshold
  requiredUsdc: 40, // WITHIN $50 limit → EXECUTE
  chain: 'eth-sepolia',
};

export function getMarketOpportunities(): MarketOpportunity[] {
  return [MARKET_A, MARKET_B];
}
