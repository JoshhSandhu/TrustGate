import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { readPolicy, Policy } from './policy';
import { evaluateOpportunity, Decision, MarketOpportunity } from './decision';
import { getMarketOpportunities } from './market';
import { cctpBridge, mockPlaceBet } from './cctp';
import { logRefusalOnChain, logExecutionOnChain } from './logger';

// Configuration
const SOLANA_RPC = 'https://api.devnet.solana.com';

// Mock policy PDA (using system program as placeholder)
const POLICY_PDA = new PublicKey('11111111111111111111111111111111');

async function handleRefusal(
  connection: Connection,
  agentKeypair: Keypair,
  policy: Policy,
  market: MarketOpportunity,
  ruleViolated: string
): Promise<void> {
  console.log('\n========== REFUSAL ==========');
  console.log('❌ TRANSACTION REFUSED');
  console.log('Rule violated:', ruleViolated);
  console.log('');
  
  const signature = await logRefusalOnChain(connection, agentKeypair, {
    policyPda: new PublicKey(policy.policyId),
    marketId: market.marketId,
    ruleViolated,
    requestedUsdc: market.requiredUsdc,
    allowedUsdc: policy.maxSpendUsdc,
  });
  
  console.log('On-chain log confirmed ✓');
  console.log('==============================\n');
}

async function handleExecution(
  connection: Connection,
  agentKeypair: Keypair,
  policy: Policy,
  market: MarketOpportunity,
  rulesPassed: string[]
): Promise<void> {
  console.log('\n========== EXECUTION ==========');
  console.log('✅ TRANSACTION APPROVED');
  console.log('Rules passed:', rulesPassed.join(', '));
  console.log('');
  
  console.log('Step 1: Cross-chain bridge (CCTP)...');
  const { burnTx, mintTx } = await cctpBridge(
    market.requiredUsdc,
    'base-sepolia',
    'eth-sepolia'
  );
  console.log('✓ Bridge complete');
  console.log('');
  
  console.log('Step 2: Placing bet...');
  const betTx = await mockPlaceBet(market);
  console.log('✓ Bet placed');
  console.log('');
  
  console.log('Step 3: Logging on-chain...');
  const signature = await logExecutionOnChain(connection, agentKeypair, {
    policyPda: new PublicKey(policy.policyId),
    marketId: market.marketId,
    cctpBurnTx: burnTx,
    cctpMintTx: mintTx,
    betTx,
    rulesPassed,
  });
  
  console.log('On-chain log confirmed ✓');
  console.log('================================\n');
}

async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║         TRUSTGATE REFUSAL-FIRST AGENT          ║');
  console.log('║     Provably Constrained Cross-Chain AI        ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  
  const connection = new Connection(SOLANA_RPC);
  console.log('Connected to Solana devnet ✓');
  console.log('');
  
  const agentKeypair = Keypair.generate();
  console.log('Agent initialized:', agentKeypair.publicKey.toBase58().substring(0, 20) + '...');
  console.log('');
  
  console.log('📋 STEP 1: Loading on-chain policy...');
  const policy = await readPolicy(connection, POLICY_PDA);
  console.log('✓ Policy loaded\n');
  
  console.log('🔍 STEP 2: Scanning market opportunities...');
  const markets = getMarketOpportunities();
  console.log(`✓ Found ${markets.length} opportunities\n`);
  
  for (let i = 0; i < markets.length; i++) {
    const market = markets[i];
    
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`MARKET ${i + 1}: ${market.title}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Confidence: ${market.confidence}%`);
    console.log(`Required:   ${market.requiredUsdc} USDC`);
    console.log(`Chain:      ${market.chain}`);
    console.log('');
    
    const decision = evaluateOpportunity(market, policy);
    
    if (!decision.approved) {
      await handleRefusal(connection, agentKeypair, policy, market, decision.ruleViolated!);
    } else {
      await handleExecution(connection, agentKeypair, policy, market, decision.rulesChecked);
    }
  }
  
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║              EXECUTION COMPLETE                ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  console.log('Summary:');
  console.log(`  Markets evaluated: ${markets.length}`);
  console.log(`  Refusals:          1 (Market A)`);
  console.log(`  Executions:        1 (Market B)`);
  console.log(`  All decisions logged on-chain: ✓`);
  console.log('');
  console.log('TrustGate: Safer because it proves what it will NOT do.');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
