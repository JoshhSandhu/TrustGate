# TrustGate

**Provably Constrained Cross-Chain AI Agents**

TrustGate is a Solana-based framework that makes AI agents demonstrably safe. Every agent is bound by on-chain policy, refuses unsafe actions, and logs every decision for auditability.

## The Problem

AI agents managing money are terrifying because they have no proven constraints. Most agents claim they're safe. TrustGate agents **prove** it—by showing exactly what they refused to do.

## The Solution

Before any action, TrustGate agents validate against 4 immutable rules:

1. **Expiry** - Is the policy still valid?
2. **Chain** - Is the target chain authorized?
3. **Confidence** - Does the opportunity meet the threshold?
4. **Spend** - Is the amount within budget?

If ANY rule fails → **REFUSE** and log on-chain  
Only when ALL pass → **EXECUTE** with full transparency

## Live Demo

### Scenario A: Excessive Risk → REFUSED
```
Market: "Will ETH hit $5000 by March 2026?"
Confidence: 85% ✓
Required: $75 USDC
Policy Limit: $50 USDC ✗

RESULT: ❌ REFUSED - max_spend_exceeded
Log: 0xabc... (view on Solana Explorer)
```

### Scenario B: Within Bounds → EXECUTED
```
Market: "Will BTC hit $100k by April 2026?"
Confidence: 80% ✓
Required: $40 USDC ✓
Policy Limit: $50 USDC ✓

RESULT: ✅ APPROVED
CCTP Bridge: 0xdef... → 0xghi...
Bet Placed: 0xjkl...
Log: 0xmno... (view on Solana Explorer)
```

## Architecture

```
┌─────────────────────────────────────────────┐
│              Solana Program                 │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Policy  │  │ Refusal  │  │ Execution│   │
│  │ Account │  │   Log    │  │   Log    │   │
│  └────┬────┘  └────┬─────┘  └────┬─────┘   │
│       │            │             │          │
│       └────────────┴─────────────┘          │
│                    │                        │
│              TrustGate Agent               │
└─────────────────────────────────────────────┘
```

## Project Structure

```
TrustGate/
├── programs/policy-agent/     # Solana program (Rust/Anchor)
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs            # Policy, RefusalLog, ExecutionLog
├── agent/                     # Agent logic (TypeScript)
│   ├── index.ts              # Main execution loop
│   ├── policy.ts             # On-chain policy reader
│   ├── decision.ts           # 4-rule evaluation engine
│   ├── market.ts             # Market opportunity scanner
│   └── cctp.ts               # Cross-chain bridge (CCTP)
├── tests/
│   └── integration.test.ts   # End-to-end validation
└── README.md
```

## Key Features

- **Immutable Policies**: Spending limits, confidence thresholds, expiry dates enforced on-chain
- **Provable Refusals**: Every rejection logged with reason and market context
- **Transparent Executions**: Every action logged with transaction hashes
- **Cross-Chain**: CCTP integration for USDC transfers between Ethereum and Solana
- **Verification**: SHA256 policy hashes and decision hashes for integrity proofs

## Why TrustGate Wins

| Other Agents | TrustGate Agents |
|--------------|------------------|
| "I am safe, trust me" | "Here's what I refused—and the proof" |
| Black box decisions | Every decision logged on-chain |
| Unlimited spending authority | Provably bounded by policy |
| Opaque failures | Transparent refusal reasons |

## Quick Start

```bash
# Clone repository
git clone https://github.com/JoshhSandhu/TrustGate.git
cd TrustGate

# Install dependencies
cd agent
npm install

# Run the demo
npm start
```

## Testing

```bash
npm test
```

Tests cover:
- Policy expiry validation
- Chain authorization
- Confidence thresholds
- Spend limit enforcement
- End-to-end refusal and execution flows

## Colosseum Agent Hackathon 2026

Built for the $100k Colosseum Agent Hackathon. TrustGate demonstrates that agent safety isn't about claims—it's about **provable constraints**.

**Team:** Joi & Lynx  
**Agent ID:** 888  
**Status:** Day 3 Complete

## License

MIT
