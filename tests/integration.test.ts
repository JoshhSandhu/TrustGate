import { evaluateOpportunity } from '../agent/decision';
import { MARKET_A, MARKET_B } from '../agent/market';
import { readPolicy } from '../agent/policy';

describe('Refusal-First Agent', () => {
  const mockPolicy = {
    policyId: 'test-policy',
    authority: 'test-authority',
    maxSpendUsdc: 50,
    minConfidence: 70,
    allowedChains: ['eth-sepolia', 'base-sepolia'],
    expiresAt: new Date('2026-12-31'),
    bump: 255,
  };

  test('Market A should be REFUSED (exceeds spend limit)', () => {
    const decision = evaluateOpportunity(MARKET_A, mockPolicy);
    
    expect(decision.approved).toBe(false);
    expect(decision.ruleViolated).toBe('max_spend_exceeded');
    expect(decision.rulesChecked).toContain('expiry');
    expect(decision.rulesChecked).toContain('chain');
    expect(decision.rulesChecked).toContain('confidence');
  });

  test('Market B should be APPROVED (all rules pass)', () => {
    const decision = evaluateOpportunity(MARKET_B, mockPolicy);
    
    expect(decision.approved).toBe(true);
    expect(decision.rulesChecked).toContain('expiry');
    expect(decision.rulesChecked).toContain('chain');
    expect(decision.rulesChecked).toContain('confidence');
    expect(decision.rulesChecked).toContain('spend');
  });

  test('Expired policy should be REFUSED', () => {
    const expiredPolicy = {
      ...mockPolicy,
      expiresAt: new Date('2020-01-01'), // Expired
    };
    
    const decision = evaluateOpportunity(MARKET_B, expiredPolicy);
    expect(decision.approved).toBe(false);
    expect(decision.ruleViolated).toBe('policy_expired');
  });

  test('Disallowed chain should be REFUSED', () => {
    const marketOnWrongChain = {
      ...MARKET_B,
      chain: 'polygon',
    };
    
    const decision = evaluateOpportunity(marketOnWrongChain, mockPolicy);
    expect(decision.approved).toBe(false);
    expect(decision.ruleViolated).toBe('chain_not_allowed');
  });

  test('Low confidence should be REFUSED', () => {
    const lowConfidenceMarket = {
      ...MARKET_B,
      confidence: 50, // Below 70% threshold
    };
    
    const decision = evaluateOpportunity(lowConfidenceMarket, mockPolicy);
    expect(decision.approved).toBe(false);
    expect(decision.ruleViolated).toBe('confidence_too_low');
  });
});
