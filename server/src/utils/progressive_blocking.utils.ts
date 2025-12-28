import { redis } from '../connect/redis';

/**
 * Progressive IP Blocking Utilities
 * Escalates block duration based on failed login attempts
 */

// Block tiers configuration
const BLOCK_TIERS = [
  { threshold: 10, duration: 5 * 60 },       // 5 minutes
  { threshold: 20, duration: 30 * 60 },      // 30 minutes
  { threshold: 30, duration: 60 * 60 },      // 1 hour
  { threshold: 40, duration: 12 * 60 * 60 }, // 12 hours
  { threshold: 50, duration: 24 * 60 * 60 }, // 24 hours
];

// Redis key patterns
const FAILED_LOGIN_KEY = (ip: string) => `failed_login:${ip}`;
const BLOCKED_IP_KEY = (ip: string) => `blocked_ip:${ip}`;
const TIER_HISTORY_KEY = (ip: string) => `tier_history:${ip}`; // Track block history

/**
 * Track a failed login attempt
 * Increments counter and blocks IP if threshold reached
 */
export async function trackFailedLogin(ip: string): Promise<void> {
  const key = FAILED_LOGIN_KEY(ip);
  
  // Increment failure counter
  const failCount = await redis.client.incr(key);
  
  // Check if we need to block this IP
  const blockDuration = getBlockDuration(failCount);
  
  if (blockDuration > 0) {
    // Get tier history to escalate
    const tierHistory = await getTierHistory(ip);
    
    // Block IP with escalated tier
    await blockIP(ip, failCount, blockDuration, tierHistory);
    
    // Set counter TTL = block duration (reset when block expires)
    await redis.client.expire(key, blockDuration);
    
    console.log(`[SECURITY] IP ${ip} failed login attempt #${failCount} - BLOCKED for ${blockDuration}s`);
  } else {
    // Not blocked yet, set TTL to 1 hour (rolling window)
    if (failCount === 1) {
      await redis.client.expire(key, 60 * 60);
    }
    console.log(`[SECURITY] IP ${ip} failed login attempt #${failCount}`);
  }
}

/**
 * Check if an IP is currently blocked
 */
export async function isIPBlocked(ip: string): Promise<boolean> {
  const key = BLOCKED_IP_KEY(ip);
  const blocked = await redis.client.exists(key);
  return blocked === 1;
}

/**
 * Get block information for an IP
 */
export async function getBlockInfo(ip: string): Promise<{
  isBlocked: boolean;
  failCount?: number;
  expiresAt?: Date;
  tier?: number;
} | null> {
  const key = BLOCKED_IP_KEY(ip);
  const data = await redis.client.get(key);
  
  if (!data) {
    return { isBlocked: false };
  }
  
  const blockInfo = JSON.parse(data);
  return {
    isBlocked: true,
    failCount: blockInfo.failCount,
    expiresAt: new Date(blockInfo.expiresAt),
    tier: blockInfo.tier,
  };
}

/**
 * Calculate block duration based on failure count
 * Returns 0 if no block needed
 */
export function getBlockDuration(failCount: number): number {
  // Find the highest tier that applies
  for (let i = BLOCK_TIERS.length - 1; i >= 0; i--) {
    const tier = BLOCK_TIERS[i];
    if (failCount >= tier.threshold) {
      return tier.duration;
    }
  }
  return 0; // No block needed
}

/**
 * Get current failure count for an IP
 */
export async function getFailureCount(ip: string): Promise<number> {
  const key = FAILED_LOGIN_KEY(ip);
  const count = await redis.client.get(key);
  return count ? parseInt(count, 10) : 0;
}

/**
 * Get tier history for an IP (exported for admin use)
 */
export async function getTierHistory(ip: string): Promise<number> {
  const key = TIER_HISTORY_KEY(ip);
  const history = await redis.client.get(key);
  return history ? parseInt(history, 10) : 0;
}

/**
 * Block an IP for a specific duration
 */
async function blockIP(ip: string, failCount: number, duration: number, tierHistory: number = 0): Promise<void> {
  const key = BLOCKED_IP_KEY(ip);
  const now = Date.now();
  const expiresAt = now + (duration * 1000);
  
  // Calculate base tier from fail count
  const baseTier = BLOCK_TIERS.findIndex(t => failCount >= t.threshold) + 1;
  
  // Escalate tier based on history (max tier 5)
  const tier = Math.min(baseTier + tierHistory, 5);
  
  // Calculate actual block duration based on escalated tier
  let actualDuration = duration;
  if (tier > baseTier) {
    // Use duration of escalated tier
    const tierIndex = Math.min(tier - 1, BLOCK_TIERS.length - 1);
    actualDuration = BLOCK_TIERS[tierIndex].duration;
  }
  
  const blockInfo = {
    blockedAt: now,
    expiresAt: now + (actualDuration * 1000),
    failCount,
    tier,
    tierHistory,
  };
  
  await redis.client.setEx(key, actualDuration, JSON.stringify(blockInfo));
  
  // Increment tier history (TTL: 7 days)
  const historyKey = TIER_HISTORY_KEY(ip);
  await redis.client.incr(historyKey);
  await redis.client.expire(historyKey, 7 * 24 * 60 * 60);
  
  console.log(`[SECURITY] IP ${ip} BLOCKED for ${actualDuration}s (Tier ${tier}, ${failCount} failed attempts, history: ${tierHistory})`);
  
  // Alert on severe attacks (Tier 4+)
  if (tier >= 4) {
    console.warn(`[SECURITY ALERT] Severe attack detected from IP ${ip} - Tier ${tier}, ${failCount} failed attempts`);
  }
}

/**
 * Reset failed login counter (call on successful login)
 */
export async function resetFailedAttempts(ip: string): Promise<void> {
  const key = FAILED_LOGIN_KEY(ip);
  const count = await getFailureCount(ip);
  
  if (count > 0) {
    await redis.client.del(key);
    console.log(`[SECURITY] IP ${ip} login successful - reset counter (was ${count})`);
  }
}

/**
 * Manually unblock an IP (admin function)
 * Also clears tier history
 */
export async function unblockIP(ip: string): Promise<void> {
  const blockedKey = BLOCKED_IP_KEY(ip);
  const failedKey = FAILED_LOGIN_KEY(ip);
  const historyKey = TIER_HISTORY_KEY(ip);
  
  await redis.client.del(blockedKey);
  await redis.client.del(failedKey);
  await redis.client.del(historyKey); // Clear tier history
  
  console.log(`[SECURITY] IP ${ip} manually unblocked (tier history cleared)`);
}

/**
 * Get block tier name for display
 */
export function getBlockTierName(tier: number): string {
  const names = ['5 minutes', '30 minutes', '1 hour', '12 hours', '24 hours'];
  return names[tier - 1] || 'unknown';
}
