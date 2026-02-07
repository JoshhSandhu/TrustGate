import { Connection, PublicKey } from '@solana/web3.js';

export interface Policy {
  policyId: string;
  authority: string;
  maxSpendUsdc: number;
  minConfidence: number;
  allowedChains: string[];
  expiresAt: Date;
  bump: number;
}

const CHAIN_MAP: { [key: number]: string } = {
  0: 'eth-sepolia',
  1: 'base-sepolia',
  2: 'arb-sepolia',
  3: 'solana-devnet',
};

export async function readPolicy(
  connection: Connection,
  policyPda: PublicKey
): Promise<Policy> {
  console.log('Reading policy from Solana...');
  console.log('Policy PDA:', policyPda.toBase58());
  
  // For demo purposes, return hardcoded policy
  // In production, this would deserialize the on-chain account
  const policy: Policy = {
    policyId: policyPda.toBase58(),
    authority: 'HumanOwner123',
    maxSpendUsdc: 50, // $50 USDC
    minConfidence: 70, // 70%
    allowedChains: ['eth-sepolia', 'base-sepolia'],
    expiresAt: new Date('2026-12-31T23:59:59Z'),
    bump: 255,
  };
  
  console.log('Policy loaded:');
  console.log('  Max spend:', policy.maxSpendUsdc, 'USDC');
  console.log('  Min confidence:', policy.minConfidence + '%');
  console.log('  Allowed chains:', policy.allowedChains.join(', '));
  console.log('  Expires:', policy.expiresAt.toISOString());
  
  return policy;
}
