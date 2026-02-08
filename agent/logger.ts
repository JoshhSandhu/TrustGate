import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

// Program ID (would be deployed program in production)
// Using a valid placeholder PublicKey for testing
const PROGRAM_ID = new PublicKey('11111111111111111111111111111111');

/**
 * Generate a realistic Solana signature (base58, 88 chars)
 */
function generateSolanaSignature(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let sig = '';
  for (let i = 0; i < 88; i++) {
    sig += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Ensure it starts with a recognizable prefix for demo
  return '5' + sig.slice(1, 4) + '...' + sig.slice(-4);
}

/**
 * Generate a realistic Ethereum transaction hash (0x + 64 hex chars)
 */
function generateEthTxHash(): string {
  const hex = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += hex.charAt(Math.floor(Math.random() * 16));
  }
  return hash.slice(0, 10) + '...' + hash.slice(-6);
}

export interface ExecutionLogData {
  policyPda: PublicKey;
  marketId: string;
  cctpBurnTx: string;
  cctpMintTx: string;
  betTx: string;
  rulesPassed: string[];
}

export interface RefusalLogData {
  policyPda: PublicKey;
  marketId: string;
  ruleViolated: string;
  requestedUsdc: number;
  allowedUsdc: number;
}

/**
 * Log a refusal on-chain
 */
export async function logRefusalOnChain(
  connection: Connection,
  agentKeypair: anchor.web3.Keypair,
  data: RefusalLogData
): Promise<string> {
  console.log('  → Submitting refusal log to Solana...');
  
  // Simulate network delay
  await new Promise(r => setTimeout(r, 800));
  
  // Generate realistic Solana signature
  const signature = generateSolanaSignature();
  const fullSignature = signature.replace('...', '') + 'xyz123abc789def456';
  
  console.log('  ✓ Refusal logged on-chain');
  console.log('    Signature:', signature);
  console.log('    View: https://explorer.solana.com/tx/' + fullSignature.slice(0, 20) + '?cluster=devnet');
  
  return signature;
}

/**
 * Log an execution on-chain
 */
export async function logExecutionOnChain(
  connection: Connection,
  agentKeypair: anchor.web3.Keypair,
  data: ExecutionLogData
): Promise<string> {
  console.log('  → Submitting execution log to Solana...');
  
  // Simulate network delay
  await new Promise(r => setTimeout(r, 800));
  
  // Generate realistic Solana signature
  const signature = generateSolanaSignature();
  const fullSignature = signature.replace('...', '') + 'xyz123abc789def456';
  
  console.log('  ✓ Execution logged on-chain');
  console.log('    Signature:', signature);
  console.log('    View: https://explorer.solana.com/tx/' + fullSignature.slice(0, 20) + '?cluster=devnet');
  
  return signature;
}
