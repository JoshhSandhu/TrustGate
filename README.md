# Refusal-First Cross-Chain Agent

A Solana-based AI agent that is provably constrained by on-chain policy. It refuses unsafe actions, executes only when conditions are satisfied, and logs every decision on-chain for auditability.

## The Problem

Most AI agents are reckless. They'll spend any amount, on any chain, without oversight. There's no proof of what they WON'T do.

## The Solution

This agent is different. Before any action, it checks:
1. **Expiry** - Is the policy still valid?
2. **Chain** - Is the target chain allowed?
3. **Confidence** - Does the opportunity meet the confidence threshold?
4. **Spend** - Is the amount within the budget?

If ANY rule fails, the agent **REFUSES** and logs the refusal on-chain.

Only when ALL rules pass does the agent execute.

## Demo Scenarios

### Market A: ETH to $5k
- Confidence: 85% (PASS)
- Required: $75 USDC
- **Result: REFUSED** (exceeds $50 limit)

### Market B: BTC to $100k
- Confidence: 80% (PASS)
- Required: $40 USDC
- **Result: EXECUTED** (all rules pass)

## Architecture

```
┌─────────────────────────────────────────────┐
│              Solana Program                 │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Policy  │  │ Refusal  │  │ Execution│   │
│  │ Account │  │   Log    │  │   Log    │   │
│  └─────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────┘
                    ▲
                    │
┌─────────────────────────────────────────────┐
│              Agent (TypeScript)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Policy  │→ │ Decision │→ │  CCTP    │  │
│  │  Reader  │  │  Engine  │  │  Bridge  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

## Project Structure

```
refusal-agent/
├── programs/policy-agent/     # Solana program (Rust/Anchor)
│   ├── Cargo.toml
│   └── src/lib.rs
├── agent/                     # Agent logic (TypeScript)
│   ├── index.ts              # Main loop
│   ├── policy.ts             # Policy reader
│   ├── decision.ts           # Decision engine
│   ├── market.ts             # Mock market data
│   └── cctp.ts               # CCTP bridge
└── README.md
```

## Key Features

- **On-Chain Policy**: Spending limits, confidence thresholds, expiry dates
- **Provable Refusals**: Every rejection is logged with reason
- **Provable Executions**: Every action is logged with transaction hashes
- **Cross-Chain**: CCTP bridge for USDC transfers
- **Verification**: Policy hashes and decision hashes for integrity

## Why This Matters

Other agents claim they're safe. This agent **proves** it.

Every decision is on-chain. Every refusal is auditable. The agent cannot violate its policy even if it wanted to.

## Running the Demo

```bash
cd agent
npm install
npm start
```

## License

MIT
