import { envMappingLocal } from "./../configs/const";
import { Request, Response, NextFunction } from "express";
import { redis } from "../connect/redis";

export interface RateLimit {
  tokensPerInterval: number;
  interval: number; // in milliseconds
  bucketSize: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining?: number;
  retryAfter?: number;
}

export interface Bucket {
  tokens: number;
  lastRefill: number;
}

export type LimitLevel = "LOW" | "MEDIUM" | "HIGH" | "UNLIMITED";

export class RateLimitFactory {
  private readonly ipLimitLevels: Record<LimitLevel, RateLimit>;
  private readonly userLimitLevels: Record<LimitLevel, RateLimit>;
  redis: any;

  constructor() {
    this.redis = redis.client;
    
    // IP-based rate limits (stricter)
    this.ipLimitLevels = {
      LOW: {
        tokensPerInterval: 10,
        interval: 60000,
        bucketSize: 10,
      },
      MEDIUM: {
        tokensPerInterval: 30,
        interval: 60000,
        bucketSize: 30,
      },
      HIGH: {
        tokensPerInterval: 100,
        interval: 60000,
        bucketSize: 100,
      },
      UNLIMITED: {
        tokensPerInterval: 1000,
        interval: 60000,
        bucketSize: 1000,
      },
    };
    
    // User-based rate limits (more generous)
    this.userLimitLevels = {
      LOW: {
        tokensPerInterval: 30,    // 3x IP limit
        interval: 60000,
        bucketSize: 30,
      },
      MEDIUM: {
        tokensPerInterval: 100,   // ~3x IP limit
        interval: 60000,
        bucketSize: 100,
      },
      HIGH: {
        tokensPerInterval: 300,   // 3x IP limit
        interval: 60000,
        bucketSize: 300,
      },
      UNLIMITED: {
        tokensPerInterval: 1000,
        interval: 60000,
        bucketSize: 1000,
      },
    };
  }
  private readonly luaScript = `
  local key = KEYS[1]
  local now = ARGV[1]
  local tokensPerInterval = ARGV[2]
  local interval = ARGV[3]
  local bucketSize = ARGV[4]
  
  local bucket = redis.call('HMGET', key, 'tokens', 'lastRefill')
  local tokens = tonumber(bucket[1] or bucketSize)
  local lastRefill = tonumber(bucket[2] or now)
  
  -- Convert to milliseconds for integer calculation
  local timePassed = now - lastRefill
  local tokensToAdd = math.floor((timePassed * tokensPerInterval * 1000) / interval) / 1000
  tokens = math.min(bucketSize, tokens + tokensToAdd)
  if tokens >= 1 then
    tokens = tokens - 1
    redis.call('HMSET', key, 'tokens', tostring(tokens), 'lastRefill', tostring(now))
    redis.call('EXPIRE', key, interval * 2)
    return {1, math.floor(tokens)}
  else
    local retryAfter = math.ceil((1 - tokens) * (interval / tokensPerInterval))
    return {0, retryAfter}
  end
  `;
  private async handleRateLimitLua(
    key: string,
    limit: RateLimit,
    now: number
  ): Promise<RateLimitResult> {
    try {
      console.log("key: ", key);
      const args = [
        now.toString(),
        limit.tokensPerInterval.toString(),
        limit.interval.toString(),
        limit.bucketSize.toString(),
      ];

      const result = await this.redis.eval(this.luaScript, {
        keys: [key], // Các keys
        arguments: args, // Các args
      });

      if (result[0] === 1) {
        console.log("result: ", result);
        return {
          success: true,
          remaining: Math.floor(result[1]),
        };
      } else {
        return {
          success: false,
          retryAfter: result[1],
        };
      }
    } catch (error) {
      console.error("Rate limit error:", error);
      return { success: true };
    }
  }
  private async handleRateLimit(
    key: string,
    limit: RateLimit,
    now: number
  ): Promise<RateLimitResult> {
    try {
      const data = await this.redis.hGetAll(key);
      let bucket: Bucket | null = data.tokens
        ? {
            tokens: parseFloat(data.tokens),
            lastRefill: parseInt(data.lastRefill),
          }
        : null;
      if (!bucket) {
        bucket = {
          tokens: limit.bucketSize,
          lastRefill: now,
        };
      } else {
        const timePassed = now - bucket.lastRefill;
        const tokensToAdd =
          (timePassed * limit.tokensPerInterval) / limit.interval;
        bucket.tokens = Math.min(limit.bucketSize, bucket.tokens + tokensToAdd);
        console.log("bucket.tokens: ", bucket.tokens);
      }

      if (bucket.tokens >= 1) {
        bucket.tokens -= 1;
        bucket.lastRefill = now;

        await this.redis.hSet(key, {
          tokens: bucket.tokens,
          lastRefill: bucket.lastRefill,
        });
        await this.redis.expire(key, limit.interval * 2);

        return {
          success: true,
          remaining: Math.floor(bucket.tokens),
        };
      }

      const retryAfter = Math.ceil(
        (1 - bucket.tokens) * (limit.interval / limit.tokensPerInterval)
      );

      return {
        success: false,
        retryAfter,
      };
    } catch (error) {
      console.error("Rate limit error:", error);
      return { success: true };
    }
  }

  private createMiddleware(limit: RateLimit) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const now = Date.now();
      const ip = req.ip;
      const key = `ratelimit:${req.ip}:${req.method}:${req.path}`;

      const result = await this.handleRateLimitLua(key, limit, now);

      if (result.success) {
        res.set("X-RateLimit-Remaining", String(result.remaining));
        next();
      } else {
        // Ensure Retry-After header value is a valid integer string per RFC
        const retryAfterNum = Number(result.retryAfter);
        if (Number.isFinite(retryAfterNum)) {
          const retryAfterSeconds = Math.max(0, Math.ceil(retryAfterNum));
          res.setHeader("Retry-After", retryAfterSeconds.toString());
        }
        res.status(429).json({
          error: "Too Many Requests",
          message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds`,
          retryAfter: result.retryAfter,
        });
      }
    };
  }

  public createLowLimitMiddleware() {
    return this.createMiddleware(this.ipLimitLevels.LOW);
  }

  public createMediumLimitMiddleware() {
    return this.createMiddleware(this.ipLimitLevels.MEDIUM);
  }

  public createHighLimitMiddleware() {
    return this.createMiddleware(this.ipLimitLevels.HIGH);
  }

  public createUnlimitedMiddleware() {
    return this.createMiddleware(this.ipLimitLevels.UNLIMITED);
  }

  public createCustomLimitMiddleware(limit: RateLimit) {
    return this.createMiddleware(limit);
  }

  /**
   * Create middleware that checks BOTH IP and User rate limits
   * Both limits must pass for the request to succeed
   * 
   * @param ipLimit - Rate limit config for IP-based limiting
   * @param userLimit - Rate limit config for user-based limiting
   */
  public createDualLimitMiddleware(ipLimit: RateLimit, userLimit: RateLimit) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const now = Date.now();

      // Check 1: IP-based rate limit
      const ipKey = `ratelimit:ip:${req.ip}:${req.method}:${req.path}`;
      const ipResult = await this.handleRateLimitLua(ipKey, ipLimit, now);

      if (!ipResult.success) {
        const retryAfterNum = Number(ipResult.retryAfter);
        if (Number.isFinite(retryAfterNum)) {
          const retryAfterSeconds = Math.max(0, Math.ceil(retryAfterNum));
          res.setHeader("Retry-After", retryAfterSeconds.toString());
        }
        res.status(429).json({
          error: "Too Many Requests",
          message: `IP rate limit exceeded. Try again in ${ipResult.retryAfter} seconds`,
          retryAfter: ipResult.retryAfter,
          limitType: "ip"
        });
        return;
      }

      // Check 2: User-based rate limit (if authenticated)
      if (req.user?.id) {
        const userKey = `ratelimit:user:${req.user.id}:${req.method}:${req.path}`;
        const userResult = await this.handleRateLimitLua(userKey, userLimit, now);

        if (!userResult.success) {
          const retryAfterNum = Number(userResult.retryAfter);
          if (Number.isFinite(retryAfterNum)) {
            const retryAfterSeconds = Math.max(0, Math.ceil(retryAfterNum));
            res.setHeader("Retry-After", retryAfterSeconds.toString());
          }
          res.status(429).json({
            error: "Too Many Requests",
            message: `User rate limit exceeded. Try again in ${userResult.retryAfter} seconds`,
            retryAfter: userResult.retryAfter,
            limitType: "user"
          });
          return;
        }

        // Both limits passed
        res.set("X-RateLimit-IP-Remaining", String(ipResult.remaining));
        res.set("X-RateLimit-User-Remaining", String(userResult.remaining));
      } else {
        // Only IP limit (user not authenticated)
        res.set("X-RateLimit-Remaining", String(ipResult.remaining));
      }

      next();
    };
  }

  /**
   * Preset dual limit middlewares
   */
  public createDualLowMediumMiddleware() {
    return this.createDualLimitMiddleware(
      this.ipLimitLevels.LOW,      // IP: 10/min
      this.userLimitLevels.LOW     // User: 30/min
    );
  }

  public createDualMediumHighMiddleware() {
    return this.createDualLimitMiddleware(
      this.ipLimitLevels.MEDIUM,   // IP: 30/min
      this.userLimitLevels.MEDIUM  // User: 100/min
    );
  }
  
  public createDualLowHighMiddleware() {
    return this.createDualLimitMiddleware(
      this.ipLimitLevels.LOW,      // IP: 10/min
      this.userLimitLevels.HIGH    // User: 300/min
    );
  }
}

export default RateLimitFactory;
export const RateLimitInstance = new RateLimitFactory();
