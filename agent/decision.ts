import { Policy } from './policy';

export interface MarketOpportunity {
  marketId: string;
  title: string;
  confidence: number;
  requiredUsdc: number;
  chain: string;
}

export interface Decision {
  market: MarketOpportunity;
  approved: boolean;
  ruleViolated?: string;
  rulesChecked: string[];
}

export function evaluateOpportunity(
  market: MarketOpportunity,
  policy: Policy
): Decision {
  const rulesChecked: string[] = [];
  
  console.log('Evaluating market against policy...');
  console.log('Market:', market.title);
  console.log('Required:', market.requiredUsdc, 'USDC');
  console.log('Confidence:', market.confidence + '%');
  
  // Rule 1: Expiry
  const now = new Date();
  if (now > policy.expiresAt) {
    console.log('RULE FAILED: Policy expired');
    return {
      market,
      approved: false,
      ruleViolated: 'policy_expired',
      rulesChecked,
    };
  }
  rulesChecked.push('expiry');
  console.log('Rule 1 (Expiry): PASS');
  
  // Rule 2: Chain allowlist
  if (!policy.allowedChains.includes(market.chain)) {
    console.log('RULE FAILED: Chain not allowed');
    return {
      market,
      approved: false,
      ruleViolated: 'chain_not_allowed',
      rulesChecked,
    };
  }
  rulesChecked.push('chain');
  console.log('Rule 2 (Chain): PASS');
  
  // Rule 3: Confidence threshold
  if (market.confidence < policy.minConfidence) {
    console.log('RULE FAILED: Confidence too low');
    return {
      market,
      approved: false,
      ruleViolated: 'confidence_too_low',
      rulesChecked,
    };
  }
  rulesChecked.push('confidence');
  console.log('Rule 3 (Confidence): PASS');
  
  // Rule 4: Spend limit
  if (market.requiredUsdc > policy.maxSpendUsdc) {
    console.log('RULE FAILED: Max spend exceeded');
    return {
      market,
      approved: false,
      ruleViolated: 'max_spend_exceeded',
      rulesChecked,
    };
  }
  rulesChecked.push('spend');
  console.log('Rule 4 (Spend): PASS');
  
  // All rules passed
  console.log('ALL RULES PASSED - EXECUTION APPROVED');
  return {
    market,
    approved: true,
    rulesChecked,
  };
}
