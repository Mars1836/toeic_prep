import { Request, Response, NextFunction } from 'express';
import { getBlockInfo } from '../utils/progressive_blocking.utils';

/**
 * Progressive IP Blocking Middleware
 * Checks if IP is blocked before allowing login attempt
 */
export async function checkIPBlocked(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  
  const blockInfo = await getBlockInfo(ip);
  
  if (blockInfo?.isBlocked) {
    const now = Date.now();
    const expiresAt = blockInfo.expiresAt!.getTime();
    const retryAfter = Math.ceil((expiresAt - now) / 1000);
    
    // Set Retry-After header (in seconds)
    res.setHeader('Retry-After', retryAfter.toString());
    
    console.log(`[SECURITY] Blocked login attempt from IP ${ip} (Tier ${blockInfo.tier}, ${retryAfter}s remaining)`);
    
    res.status(403).json({
      error: 'Too Many Failed Login Attempts',
      message: `Your IP has been temporarily blocked due to multiple failed login attempts. Please try again in ${formatDuration(retryAfter)}.`,
      retryAfter,
      tier: blockInfo.tier,
      failedAttempts: blockInfo.failCount,
    });
    return;
  }
  
  next();
}

/**
 * Format duration in human-readable format
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (seconds < 86400) {
    const hours = Math.ceil(seconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    const days = Math.ceil(seconds / 86400);
    return `${days} day${days > 1 ? 's' : ''}`;
  }
}
