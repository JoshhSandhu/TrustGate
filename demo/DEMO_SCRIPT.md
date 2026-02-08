# TrustGate Demo Video Script
## "Provably Constrained Cross-Chain AI"

---

### Hook (0:00-0:15)
**[Screen: Terminal with TrustGate ASCII art]**

**VO:** 
"AI agents are about to manage billions of dollars. There's just one problem: we have no way to prove what they WON'T do."

**[Cut to code: Policy struct with spending limits]**

"TrustGate changes the game."

---

### The Problem (0:15-0:45)
**[Screen: Slide with scary stats]**

**VO:**
"Current AI agents make two dangerous claims:
One: 'I'm safe, trust me.'
Two: 'I won't spend too much.'

But here's what no one shows you: the receipts."

**[Cut to: Hexx/Claw competitor screenshot]**

"Our competitor has bounded spending. Great. But can they prove what their agent refused? Can they show you the policy that constrained it?"

**[Beat]**

"No. They can't."

---

### The Solution (0:45-1:30)
**[Screen: TrustGate architecture diagram]**

**VO:**
"TrustGate is different. Every agent is provably constrained by on-chain policy. Before ANY action, four immutable rules are checked:"

**[Screen: Terminal showing rules]**

```
✓ Expiry check: Policy valid until 2026-12-31
✓ Chain check: base-sepolia authorized
✓ Confidence check: 80% ≥ 70% threshold
✗ Spend check: $75 > $50 limit ← VIOLATION
```

"If ANY rule fails, the agent REFUSES—and logs that refusal on-chain for anyone to verify."

**[Screen: Solana Explorer showing RefusalLog]**

"This isn't a claim. This is proof."

---

### Live Demo (1:30-3:00)
**[Screen: Terminal running agent]**

**VO:**
"Watch TrustGate in action. We've configured our agent with a simple policy: max $50 USDC per transaction, minimum 70% confidence, expires December 2026."

**[Agent runs - Market A]**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MARKET 1: Will ETH hit $5000 by March 2026?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Confidence: 85%
Required:   75 USDC
Chain:      base-sepolia

❌ REFUSED - max_spend_exceeded
On-chain log: 5xKj9...mP2v
```

**VO:**
"Market A: ETH at five thousand. High confidence, but needs seventy-five dollars. Our limit is fifty. REFUSED. The refusal is logged on-chain with the exact reason."

**[Agent runs - Market B]**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MARKET 2: Will BTC hit $100k by April 2026?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Confidence: 80%
Required:   40 USDC
Chain:      base-sepolia

✅ APPROVED
Step 1: Cross-chain bridge (CCTP)...
  ✓ Burn tx: 0x7a3f...9e2b
  ✓ Mint tx: 0x8c4d...1f7a
Step 2: Placing bet...
  ✓ Bet tx: 0x9d5e...3g8b
On-chain log: 3mNp7...kR5x
```

**VO:**
"Market B: BTC at one hundred K. Within our limit. All rules pass. The agent executes—bridging USDC via CCTP, placing the bet, and logging everything on-chain."

---

### The Receipts (3:00-3:30)
**[Screen: Solana Explorer screenshots]**

**VO:**
"Here's what makes TrustGate different. We don't just tell you the agent is safe. We show you:

One: The policy hash that constrained the decision.
Two: The decision hash proving integrity.
Three: The exact rule violated—or all rules passed.

Anyone can verify. No trust required."

---

### Competitive Edge (3:30-4:00)
**[Screen: Comparison table]**

| Feature | Others | TrustGate |
|---------|--------|-----------|
| Bounded spending | ✓ | ✓ |
| On-chain policy | ✗ | ✓ |
| Provable refusals | ✗ | ✓ |
| Cross-chain (CCTP) | ✗ | ✓ |
| Audit logs | ✗ | ✓ |

**VO:**
"Hexx/Claw has bounded spending. We have that too. But TrustGate adds something they can't match: provable refusals, on-chain audit trails, and real cross-chain execution via CCTP."

---

### Close (4:00-4:30)
**[Screen: TrustGate logo + GitHub link]**

**VO:**
"TrustGate. Safer because it proves what it will NOT do."

**[Screen: Terminal]**

```
TrustGate: Safer because it proves what it will NOT do.
```

**VO:**
"Open source. Solana native. Ready for the agent economy."

**[Fade to black]**

---

## Recording Notes

- Use terminalizer or asciinema for clean terminal recordings
- Keep terminal font large (14pt+) for readability
- Use Solarized Dark theme
- Record at 1920x1080
- Target length: 3-4 minutes
- Background music: Instrumental, futuristic but subtle
