use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hash;

declare_id!("PolicyAgent1111111111111111111111111111111");

#[program]
pub mod policy_agent {
    use super::*;

    /// Initialize a new policy with spending constraints
    pub fn initialize_policy(
        ctx: Context<InitializePolicy>,
        max_spend_usdc: u64,
        min_confidence: u8,
        allowed_chains: [u8; 4],
        expires_at: i64,
    ) -> Result<()> {
        let policy = &mut ctx.accounts.policy;
        let authority = ctx.accounts.authority.key();
        
        policy.authority = authority;
        policy.max_spend_usdc = max_spend_usdc;
        policy.min_confidence = min_confidence;
        policy.allowed_chains = allowed_chains;
        policy.expires_at = expires_at;
        policy.bump = ctx.bumps.policy;
        
        msg!("Policy initialized by: {:?}", authority);
        msg!("Max spend: {} USDC", max_spend_usdc);
        msg!("Min confidence: {}%", min_confidence);
        
        Ok(())
    }

    /// Log a refusal when agent rejects an opportunity
    pub fn log_refusal(
        ctx: Context<LogRefusal>,
        market_id: String,
        rule_violated: String,
        requested_usdc: u64,
    ) -> Result<()> {
        let policy = &ctx.accounts.policy;
        let refusal = &mut ctx.accounts.refusal_log;
        
        // Create policy hash
        let policy_data = format!(
            "{}:{}:{}:{:?}:{}",
            policy.authority,
            policy.max_spend_usdc,
            policy.min_confidence,
            policy.allowed_chains,
            policy.expires_at
        );
        let policy_hash = hash(policy_data.as_bytes()).to_bytes();
        
        // Create decision hash
        let timestamp = Clock::get()?.unix_timestamp;
        let decision_data = format!(
            "{:?}:{:?}:{}",
            policy_hash,
            market_id,
            timestamp
        );
        let decision_hash = hash(decision_data.as_bytes()).to_bytes();
        
        refusal.policy = policy.key();
        refusal.policy_hash = policy_hash;
        refusal.decision_hash = decision_hash;
        refusal.market_id = market_id.clone();
        refusal.rule_violated = rule_violated.clone();
        refusal.requested_usdc = requested_usdc;
        refusal.allowed_usdc = policy.max_spend_usdc;
        refusal.timestamp = timestamp;
        refusal.bump = ctx.bumps.refusal_log;
        
        msg!("REFUSAL LOGGED");
        msg!("Market: {}", market_id);
        msg!("Rule violated: {}", rule_violated);
        msg!("Requested: {} USDC", requested_usdc);
        msg!("Allowed: {} USDC", policy.max_spend_usdc);
        
        Ok(())
    }

    /// Log an execution when agent completes a transaction
    pub fn log_execution(
        ctx: Context<LogExecution>,
        market_id: String,
        cctp_burn_tx: String,
        cctp_mint_tx: String,
        bet_tx: String,
    ) -> Result<()> {
        let policy = &ctx.accounts.policy;
        let execution = &mut ctx.accounts.execution_log;
        
        // Create policy hash
        let policy_data = format!(
            "{}:{}:{}:{:?}:{}",
            policy.authority,
            policy.max_spend_usdc,
            policy.min_confidence,
            policy.allowed_chains,
            policy.expires_at
        );
        let policy_hash = hash(policy_data.as_bytes()).to_bytes();
        
        // Create decision hash
        let timestamp = Clock::get()?.unix_timestamp;
        let decision_data = format!(
            "{:?}:{:?}:{}",
            policy_hash,
            market_id,
            timestamp
        );
        let decision_hash = hash(decision_data.as_bytes()).to_bytes();
        
        execution.policy = policy.key();
        execution.policy_hash = policy_hash;
        execution.decision_hash = decision_hash;
        execution.market_id = market_id.clone();
        execution.rules_passed = vec![
            "expiry".to_string(),
            "chain".to_string(),
            "confidence".to_string(),
            "spend".to_string(),
        ];
        execution.cctp_burn_tx = cctp_burn_tx;
        execution.cctp_mint_tx = cctp_mint_tx;
        execution.bet_tx = bet_tx;
        execution.timestamp = timestamp;
        execution.bump = ctx.bumps.execution_log;
        
        msg!("EXECUTION LOGGED");
        msg!("Market: {}", market_id);
        msg!("CCTP Burn: {}", execution.cctp_burn_tx);
        msg!("CCTP Mint: {}", execution.cctp_mint_tx);
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePolicy<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + Policy::SIZE,
        seeds = [b"policy", authority.key().as_ref()],
        bump
    )]
    pub policy: Account<'info, Policy>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(market_id: String, rule_violated: String, requested_usdc: u64)]
pub struct LogRefusal<'info> {
    pub policy: Account<'info, Policy>,
    
    #[account(mut)]
    pub agent: Signer<'info>,
    
    #[account(
        init,
        payer = agent,
        space = 8 + RefusalLog::SIZE,
        seeds = [
            b"refusal",
            policy.key().as_ref(),
            agent.key().as_ref(),
            &Clock::get()?.unix_timestamp.to_le_bytes(),
        ],
        bump
    )]
    pub refusal_log: Account<'info, RefusalLog>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(market_id: String, cctp_burn_tx: String, cctp_mint_tx: String, bet_tx: String)]
pub struct LogExecution<'info> {
    pub policy: Account<'info, Policy>,
    
    #[account(mut)]
    pub agent: Signer<'info>,
    
    #[account(
        init,
        payer = agent,
        space = 8 + ExecutionLog::SIZE,
        seeds = [
            b"execution",
            policy.key().as_ref(),
            agent.key().as_ref(),
            &Clock::get()?.unix_timestamp.to_le_bytes(),
        ],
        bump
    )]
    pub execution_log: Account<'info, ExecutionLog>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Policy {
    pub authority: Pubkey,
    pub max_spend_usdc: u64,
    pub min_confidence: u8,
    pub allowed_chains: [u8; 4],
    pub expires_at: i64,
    pub bump: u8,
}

impl Policy {
    pub const SIZE: usize = 32 + 8 + 1 + 4 + 8 + 1;
}

#[account]
pub struct RefusalLog {
    pub policy: Pubkey,
    pub policy_hash: [u8; 32],
    pub decision_hash: [u8; 32],
    pub market_id: String,
    pub rule_violated: String,
    pub requested_usdc: u64,
    pub allowed_usdc: u64,
    pub timestamp: i64,
    pub bump: u8,
}

impl RefusalLog {
    pub const SIZE: usize = 32 + 32 + 32 + 4 + 64 + 4 + 32 + 8 + 8 + 8 + 1;
}

#[account]
pub struct ExecutionLog {
    pub policy: Pubkey,
    pub policy_hash: [u8; 32],
    pub decision_hash: [u8; 32],
    pub market_id: String,
    pub rules_passed: Vec<String>,
    pub cctp_burn_tx: String,
    pub cctp_mint_tx: String,
    pub bet_tx: String,
    pub timestamp: i64,
    pub bump: u8,
}

impl ExecutionLog {
    pub const SIZE: usize = 32 + 32 + 32 + 4 + 64 + 4 + 256 + 4 + 128 + 4 + 128 + 4 + 128 + 8 + 1;
}

#[error_code]
pub enum PolicyError {
    #[msg("Policy has expired")]
    PolicyExpired,
    #[msg("Chain not allowed")]
    ChainNotAllowed,
    #[msg("Confidence below threshold")]
    ConfidenceTooLow,
    #[msg("Spend limit exceeded")]
    SpendLimitExceeded,
}
