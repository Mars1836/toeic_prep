"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitInstance = exports.RateLimitFactory = void 0;
const redis_1 = require("../connect/redis");
class RateLimitFactory {
    constructor() {
        this.luaScript = `
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
        this.redis = redis_1.redis.client;
        this.limitLevels = {
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
    }
    handleRateLimitLua(key, limit, now) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("key: ", key);
                const args = [
                    now.toString(),
                    limit.tokensPerInterval.toString(),
                    limit.interval.toString(),
                    limit.bucketSize.toString(),
                ];
                const result = yield this.redis.eval(this.luaScript, {
                    keys: [key], // Các keys
                    arguments: args, // Các args
                });
                if (result[0] === 1) {
                    console.log("result: ", result);
                    return {
                        success: true,
                        remaining: Math.floor(result[1]),
                    };
                }
                else {
                    return {
                        success: false,
                        retryAfter: result[1],
                    };
                }
            }
            catch (error) {
                console.error("Rate limit error:", error);
                return { success: true };
            }
        });
    }
    handleRateLimit(key, limit, now) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.redis.hGetAll(key);
                let bucket = data.tokens
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
                }
                else {
                    const timePassed = now - bucket.lastRefill;
                    const tokensToAdd = (timePassed * limit.tokensPerInterval) / limit.interval;
                    bucket.tokens = Math.min(limit.bucketSize, bucket.tokens + tokensToAdd);
                    console.log("bucket.tokens: ", bucket.tokens);
                }
                if (bucket.tokens >= 1) {
                    bucket.tokens -= 1;
                    bucket.lastRefill = now;
                    yield this.redis.hSet(key, {
                        tokens: bucket.tokens,
                        lastRefill: bucket.lastRefill,
                    });
                    yield this.redis.expire(key, limit.interval * 2);
                    return {
                        success: true,
                        remaining: Math.floor(bucket.tokens),
                    };
                }
                const retryAfter = Math.ceil((1 - bucket.tokens) * (limit.interval / limit.tokensPerInterval));
                return {
                    success: false,
                    retryAfter,
                };
            }
            catch (error) {
                console.error("Rate limit error:", error);
                return { success: true };
            }
        });
    }
    createMiddleware(limit) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const ip = req.ip;
            const key = `ratelimit:${req.ip}:${req.method}:${req.path}`;
            const result = yield this.handleRateLimitLua(key, limit, now);
            if (result.success) {
                res.set("X-RateLimit-Remaining", String(result.remaining));
                next();
            }
            else {
                res.set("Retry-After", String(result.retryAfter));
                res.status(429).json({
                    error: "Too Many Requests",
                    message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds`,
                    retryAfter: result.retryAfter,
                });
            }
        });
    }
    createLowLimitMiddleware() {
        return this.createMiddleware(this.limitLevels.LOW);
    }
    createMediumLimitMiddleware() {
        return this.createMiddleware(this.limitLevels.MEDIUM);
    }
    createHighLimitMiddleware() {
        return this.createMiddleware(this.limitLevels.HIGH);
    }
    createUnlimitedMiddleware() {
        return this.createMiddleware(this.limitLevels.UNLIMITED);
    }
    createCustomLimitMiddleware(limit) {
        return this.createMiddleware(limit);
    }
}
exports.RateLimitFactory = RateLimitFactory;
exports.default = RateLimitFactory;
exports.RateLimitInstance = new RateLimitFactory();
