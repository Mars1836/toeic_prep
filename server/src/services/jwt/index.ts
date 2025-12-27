import jwt from "jsonwebtoken";
import { constEnv } from "../../configs/const";
import { redis } from "../../connect/redis";
import { v4 as uuidv4 } from "uuid";
import { RefreshTokenReuseError } from "../../errors/refresh_token_reuse_error";

export interface UserPayload {
  id: string;
  email: string;
  role?: string; // 'admin' | 'user'
  jti?: string; // JWT ID - unique identifier for each token
}

export interface RefreshTokenPayload extends UserPayload {
  jti: string; // Required for refresh tokens
  role?: string; // 'admin' | 'user'
}

export interface AccessTokenPayload extends UserPayload {
  jti: string; // Required for access tokens
  parentRefreshJti?: string; // JTI của refresh token tạo ra access token này
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenData {
  userId: string;
  email: string;
  jti: string;
  iat: number; // issued at
  exp: number; // expiration
  usedCount: number; // Số lần token đã được sử dụng (0 = chưa dùng, 1 = đã dùng 1 lần)
  createdAt: string;
}

const ACCESS_TOKEN_EXPIRE = constEnv.jwtAccessTokenTTL || "15m";

const REFRESH_TOKEN_TTL_STRING = constEnv.jwtRefreshTokenTTL || "7d";

function parseTimeToSeconds(timeStr: string): number {
  const match = timeStr.match(/^(\d+)([smhd])$/i);
  if (!match) {
    throw new Error(
      `Invalid time format: ${timeStr}. Use format like "7d", "1h", "30m", "90s"`
    );
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "s":
      return value; // seconds
    case "m":
      return value * 60; // minutes to seconds
    case "h":
      return value * 60 * 60; // hours to seconds
    case "d":
      return value * 24 * 60 * 60; // days to seconds
    default:
      throw new Error(`Invalid time unit: ${unit}. Use s, m, h, or d`);
  }
}

// Parse sang seconds cho Redis (Redis EX chỉ nhận số seconds)
const REFRESH_TOKEN_EXPIRE_SECONDS = parseTimeToSeconds(
  REFRESH_TOKEN_TTL_STRING
);

/**
 * Generate access token (short-lived)
 * @param payload - User payload
 * @param parentRefreshJti - JTI của refresh token tạo ra access token này (để tracking)
 */
export function generateAccessToken(
  payload: UserPayload,
  parentRefreshJti?: string
): string {
  if (!constEnv.jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const jti = uuidv4(); // Unique ID cho access token

  const tokenPayload: AccessTokenPayload = {
    id: payload.id,
    email: payload.email,
    jti,
    parentRefreshJti,
  };

  const token = jwt.sign(tokenPayload, constEnv.jwtSecret, {
    expiresIn: ACCESS_TOKEN_EXPIRE,
    issuer: "toeic-prep-server",
    audience: "toeic-prep-client",
  });

  // Track access token nếu có parentRefreshJti (để có thể revoke sau này)
  if (parentRefreshJti) {
    // Fire and forget - không cần await để không làm chậm response
    trackAccessToken(payload.id, parentRefreshJti, jti).catch((err) => {
      console.error("Failed to track access token:", err);
    });
    console.log(`[JWT] Tracking access token ${jti} for refresh token ${parentRefreshJti}`);
  } else {
    console.log(`[JWT] Access token ${jti} created WITHOUT parent refresh token tracking`);
  }

  return token;
}

/**
 * Generate refresh token (long-lived) và lưu vào Redis với detailed info
 */
export async function generateRefreshToken(
  payload: UserPayload
): Promise<string> {
  if (!constEnv.jwtRefreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }

  const jti = uuidv4(); // Unique ID cho refresh token
  const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const exp = now + REFRESH_TOKEN_EXPIRE_SECONDS;

  const tokenPayload: RefreshTokenPayload = {
    id: payload.id,
    email: payload.email,
    jti,
  };

  const refreshToken = jwt.sign(tokenPayload, constEnv.jwtRefreshSecret, {
    expiresIn: REFRESH_TOKEN_TTL_STRING,
    issuer: "toeic-prep-server",
    audience: "toeic-prep-client",
  });

  // Lưu refresh token vào Redis với key format: refreshtoken:{userId}:{jti}
  const redisKey = `refreshtoken:${payload.id}:${jti}`;

  const tokenData: RefreshTokenData = {
    userId: payload.id,
    email: payload.email,
    jti,
    iat: now,
    exp,
    usedCount: 0, // Chưa được sử dụng
    createdAt: new Date().toISOString(),
  };

  // Lưu dưới dạng JSON
  await redis.client.set(redisKey, JSON.stringify(tokenData), {
    EX: REFRESH_TOKEN_EXPIRE_SECONDS,
  });

  return refreshToken;
}

/**
 * Generate cả access token và refresh token
 */
export async function generateTokenPair(
  payload: UserPayload
): Promise<TokenPair> {
  const [accessToken, refreshToken] = await Promise.all([
    Promise.resolve(generateAccessToken(payload)),
    generateRefreshToken(payload),
  ]);

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): UserPayload {
  if (!constEnv.jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  try {
    const decoded = jwt.verify(token, constEnv.jwtSecret, {
      issuer: "toeic-prep-server",
      audience: "toeic-prep-client",
    }) as UserPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Access token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid access token");
    }
    throw error;
  }
}

/**
 * Verify refresh token với reuse detection
 * Nếu token đã được sử dụng (usedCount > 0), coi như bị compromise và revoke tất cả tokens
 */
export async function verifyRefreshToken(
  token: string
): Promise<RefreshTokenPayload> {
  if (!constEnv.jwtRefreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }
  try {
    const decoded = jwt.verify(token, constEnv.jwtRefreshSecret, {
      issuer: "toeic-prep-server",
      audience: "toeic-prep-client",
    }) as RefreshTokenPayload;

    if (!decoded.jti) {
      throw new Error("Invalid refresh token: missing jti");
    }

    // Lấy token data từ Redis
    const redisKey = `refreshtoken:${decoded.id}:${decoded.jti}`;
    const storedData = await redis.client.get(redisKey);

    if (!storedData) {
      throw new Error("Refresh token not found or expired");
    }

    const tokenData: RefreshTokenData = JSON.parse(storedData);

    // Note: Reuse detection được xử lý bởi atomic Lua script trong markRefreshTokenAsUsed()
    // Không cần check usedCount ở đây vì có race condition risk

    // **SECURITY: Check if token is suspicious (pending verification)**
    const isSuspicious = await isRefreshTokenSuspicious(decoded.id, decoded.jti);
    if (isSuspicious) {
      // Import dynamically to avoid circular dependency if needed, or assume it's available
      const { PendingVerificationError } = require("../../errors/pending_verification_error");
      throw new PendingVerificationError();
    }

    // Token hợp lệ và chưa được sử dụng
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Refresh token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid refresh token");
    }
    throw error;
  }
}

/**
 * Mark refresh token as used - Atomic operation với Lua script
 * Nếu token đã used (usedCount > 0) → detect reuse → blacklist toàn bộ token family
 */
export async function markRefreshTokenAsUsed(
  userId: string,
  jti: string,
  childRefreshJti?: string
): Promise<void> {
  const redisKey = `refreshtoken:${userId}:${jti}`;

  if (childRefreshJti) {
    const tokenData = await redis.client.get(redisKey);
    if (tokenData) {
      const parsed: RefreshTokenData = JSON.parse(tokenData);
      const familyId = (parsed as any).familyId || jti;
      
      const familyKey = `token_family:${userId}:${familyId}`;
      await redis.client.sAdd(familyKey, childRefreshJti);
      await redis.client.expire(familyKey, REFRESH_TOKEN_EXPIRE_SECONDS);
      
      const childKey = `refreshtoken:${userId}:${childRefreshJti}`;
      const childData = await redis.client.get(childKey);
      if (childData) {
        const childParsed = JSON.parse(childData);
        (childParsed as any).familyId = familyId;
        const ttl = await redis.client.ttl(childKey);
        if (ttl > 0) {
          await redis.client.set(childKey, JSON.stringify(childParsed), { EX: ttl });
        }
      }
      
      console.log(`[JWT] Added child token ${childRefreshJti} to family ${familyId}`);
    }
  }

  // Atomic check-and-increment
  const luaScript = `
    local key = KEYS[1]
    local data = redis.call('GET', key)
    
    if not data then
      return -1
    end
    
    local tokenData = cjson.decode(data)
    
    -- Check if already used
    if tokenData.usedCount > 0 then
      return 0
    end
    
    -- Mark as used
    tokenData.usedCount = tokenData.usedCount + 1
    
    -- Get TTL and update
    local ttl = redis.call('TTL', key)
    if ttl > 0 then
      redis.call('SET', key, cjson.encode(tokenData), 'EX', ttl)
      return 1
    else
      return -1
    end
  `;

  // Execute Lua script
  const result = await redis.client.eval(luaScript, {
    keys: [redisKey],
    arguments: [],
  }) as number;

  if (result === -1) {
    throw new Error("Refresh token not found or expired");
  }

  if (result === 0) {
    // REUSE DETECTED
    console.error(
      `[SECURITY ALERT] Refresh token reuse detected during mark! UserId: ${userId}, JTI: ${jti}`
    );
    
    const tokenData = await redis.client.get(redisKey);
    if (tokenData) {
      const parsed: RefreshTokenData = JSON.parse(tokenData);
      const familyId = (parsed as any).familyId || jti;
      
      console.log(`[SECURITY] Token family ${familyId} compromised, blacklisting all tokens in family`);
      
      const familyKey = `token_family:${userId}:${familyId}`;
      const familyTokens = await redis.client.sMembers(familyKey);
      
      console.log(`[SECURITY] Found ${familyTokens.length} token(s) in family:`, familyTokens);
      for (const refreshJti of familyTokens) {
        await blacklistAccessTokensByRefreshToken(userId, refreshJti);
      }
      

      await redis.client.del(familyKey);
    } else {
      console.log(`[SECURITY] Token data not found for ${jti}`);
    }
    
    throw new RefreshTokenReuseError(userId, jti);
  }


  console.log(`[JWT] Refresh token marked as used: ${jti}`);
}

/** Revoke refresh token */
export async function revokeRefreshToken(
  userId: string,
  jti: string
): Promise<void> {
  const redisKey = `refreshtoken:${userId}:${jti}`;
  await redis.client.del(redisKey);


  const trackingKey = `access_tokens:${userId}:${jti}`;
  await redis.client.del(trackingKey);
}

/** Blacklist access tokens của một refresh token */
async function blacklistAccessTokensByRefreshToken(
  userId: string,
  refreshJti: string
): Promise<void> {
  console.log(`[SECURITY] Attempting to blacklist access tokens for refresh token ${refreshJti}`);
  
  const trackingKey = `access_tokens:${userId}:${refreshJti}`;
  const accessJtis = await redis.client.sMembers(trackingKey);

  console.log(`[SECURITY] Found ${accessJtis.length} access token(s) to blacklist:`, accessJtis);

  if (accessJtis.length === 0) {
    console.log(
      `[JWT] No access tokens found for refresh token ${refreshJti}`
    );
    return;
  }


  for (const accessJti of accessJtis) {
    await blacklistAccessToken(accessJti, REFRESH_TOKEN_EXPIRE_SECONDS);
    console.log(`[SECURITY] Blacklisted access token: ${accessJti}`);
  }


  await redis.client.del(trackingKey);

  console.log(
    `[SECURITY] Blacklisted ${accessJtis.length} access token(s) for refresh token ${refreshJti}`
  );
}


/**
 * Track access token được generate từ refresh token
 * Lưu vào Redis set để có thể revoke sau này
 */
async function trackAccessToken(
  userId: string,
  refreshJti: string,
  accessJti: string
): Promise<void> {
  const trackingKey = `access_tokens:${userId}:${refreshJti}`;

  // Thêm access token JTI vào set
  await redis.client.sAdd(trackingKey, accessJti);

  // Set expire cho tracking key (same as refresh token)
  await redis.client.expire(trackingKey, REFRESH_TOKEN_EXPIRE_SECONDS);
}

/**
 * Blacklist specific access token (add to blacklist)
 */
export async function blacklistAccessToken(
  jti: string,
  expiresIn: number
): Promise<void> {
  const blacklistKey = `access_token_blacklist:${jti}`;
  await redis.client.set(blacklistKey, "1", {
    EX: expiresIn, // Auto expire when token would expire anyway
  });
}

/**
 * Check if access token is blacklisted
 */
export async function isAccessTokenBlacklisted(jti: string): Promise<boolean> {
  const blacklistKey = `access_token_blacklist:${jti}`;
  const exists = await redis.client.exists(blacklistKey);
  return exists === 1;
}

/**
 * Revoke all refresh tokens của user
 * Được gọi khi detect token reuse hoặc user logout all devices
 */
export async function revokeAllUserTokens(userId: string): Promise<void> {
  // Tìm tất cả refresh tokens của user
  const pattern = `refreshtoken:${userId}:*`;
  const keys = await redis.client.keys(pattern);

  if (keys.length === 0) {
    return;
  }

  // Lấy tất cả JTI của refresh tokens
  const refreshJtis: string[] = [];
  for (const key of keys) {
    const parts = key.split(":");
    if (parts.length === 3) {
      refreshJtis.push(parts[2]); // JTI is the third part
    }
  }

  // Revoke tất cả access tokens được generate từ các refresh tokens này
  for (const jti of refreshJtis) {
    const trackingKey = `access_tokens:${userId}:${jti}`;
    const accessJtis = await redis.client.sMembers(trackingKey);

    // Blacklist tất cả access tokens
    for (const accessJti of accessJtis) {
      await blacklistAccessToken(accessJti, REFRESH_TOKEN_EXPIRE_SECONDS);
    }

    // Xóa tracking key
    await redis.client.del(trackingKey);
  }

  // Xóa tất cả refresh tokens
  await redis.client.del(keys);

  console.log(
    `[SECURITY] Revoked all tokens for user ${userId}. Total refresh tokens: ${keys.length}`
  );
}

// ==================== SUSPICIOUS TOKEN MANAGEMENT ====================

/**
 * Suspicious token data structure
 * Lưu thông tin về token đang chờ xác nhận từ user
 */
export interface SuspiciousTokenData {
  userId: string;
  email: string;
  accessJti: string;
  refreshJti: string;
  accessToken: string;
  refreshToken: string;
  deviceInfo: any; // DeviceInfo từ device fingerprinting
  createdAt: string;
  expiresAt: number; // Unix timestamp in seconds
  activated?: boolean;
}

// Suspicious token TTL: 30 phút (user phải xác nhận trong 30 phút)
const SUSPICIOUS_TOKEN_TTL_SECONDS = 30 * 60; // 30 minutes

/**
 * Lưu token pair vào Redis dạng "suspicious" (chờ xác nhận từ email)
 * @param userId - User ID
 * @param tokens - Token pair (access + refresh)
 * @param deviceInfo - Device information
 * @returns Token ID để gửi trong email
 */
export async function saveSuspiciousToken(
  userId: string,
  email: string,
  tokens: TokenPair,
  deviceInfo: any
): Promise<string> {
  // Decode tokens để lấy JTI
  const accessDecoded = jwt.decode(tokens.accessToken) as AccessTokenPayload;
  const refreshDecoded = jwt.decode(tokens.refreshToken) as RefreshTokenPayload;

  if (!accessDecoded?.jti || !refreshDecoded?.jti) {
    throw new Error("Failed to decode token JTI");
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + SUSPICIOUS_TOKEN_TTL_SECONDS;

  const suspiciousData: SuspiciousTokenData = {
    userId,
    email,
    accessJti: accessDecoded.jti,
    refreshJti: refreshDecoded.jti,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    deviceInfo,
    createdAt: new Date().toISOString(),
    expiresAt,
    activated: false
  };

  // Lưu với key: suspicious_token:{userId}:{refreshJti}
  const redisKey = `suspicious_token:${userId}:${refreshDecoded.jti}`;
  await redis.client.set(redisKey, JSON.stringify(suspiciousData), {
    EX: SUSPICIOUS_TOKEN_TTL_SECONDS,
  });

  // Tạo một key mapping từ accessJti để dễ lookup
  const accessJtiKey = `suspicious_access_jti:${accessDecoded.jti}`;
  await redis.client.set(accessJtiKey, refreshDecoded.jti, {
    EX: SUSPICIOUS_TOKEN_TTL_SECONDS,
  });

  console.log(
    `[Suspicious Token] Saved for user ${userId}, refreshJti: ${refreshDecoded.jti}`
  );

  // Return refreshJti làm tokenId để gửi trong email
  return refreshDecoded.jti;
}

/**
 * Lấy suspicious token data từ Redis
 * @param userId - User ID
 * @param tokenId - Refresh JTI (token ID)
 */
export async function getSuspiciousToken(
  userId: string,
  tokenId: string
): Promise<SuspiciousTokenData | null> {
  const redisKey = `suspicious_token:${userId}:${tokenId}`;
  const data = await redis.client.get(redisKey);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as SuspiciousTokenData;
}

/**
 * Kích hoạt suspicious token (user xác nhận "Yes, this was me")
 * - Chuyển refresh token từ suspicious sang active
 * - Trust device
 * - Xóa suspicious token record
 */
export async function activateSuspiciousToken(
  userId: string,
  tokenId: string
): Promise<TokenPair> {
  const suspiciousData = await getSuspiciousToken(userId, tokenId);

  if (!suspiciousData) {
    throw new Error("Suspicious token not found or expired");
  }

  // Token đã được tạo sẵn trong Redis bởi generateTokenPair rồi
  // Chúng ta chỉ cần xóa flag suspicious thôi

  // Xóa suspicious token records
  const suspiciousKey = `suspicious_token:${userId}:${tokenId}`;
  const accessJtiKey = `suspicious_access_jti:${suspiciousData.accessJti}`;
  await redis.client.del(suspiciousKey);
  await redis.client.del(accessJtiKey);

  console.log(
    `[Suspicious Token] Activated for user ${userId}, tokenId: ${tokenId}`
  );

  return {
    accessToken: suspiciousData.accessToken,
    refreshToken: suspiciousData.refreshToken,
  };
}

/**
 * Blacklist suspicious token (user xác nhận "No, secure my account")
 * - Blacklist cả access và refresh token
 * - Xóa suspicious token record
 */
export async function blacklistSuspiciousToken(
  userId: string,
  tokenId: string
): Promise<void> {
  const suspiciousData = await getSuspiciousToken(userId, tokenId);

  if (!suspiciousData) {
    // Token đã hết hạn hoặc không tồn tại, không cần làm gì
    return;
  }

  // Blacklist access token
  const accessTokenDecoded = jwt.decode(suspiciousData.accessToken) as jwt.JwtPayload & { exp?: number };
  if (accessTokenDecoded?.exp) {
    const expiresIn = accessTokenDecoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn > 0) {
      await blacklistAccessToken(suspiciousData.accessJti, expiresIn);
    }
  }

  // Blacklist refresh token bằng cách XÓA khỏi Redis (vì verifyRefreshToken check Redis)
  const refreshRedisKey = `refreshtoken:${userId}:${suspiciousData.refreshJti}`;
  await redis.client.del(refreshRedisKey);

  // Xóa tracking for refresh token
  const trackingKey = `access_tokens:${userId}:${suspiciousData.refreshJti}`;
  await redis.client.del(trackingKey);

  // Xóa suspicious token records
  const suspiciousKey = `suspicious_token:${userId}:${tokenId}`;
  const accessJtiKey = `suspicious_access_jti:${suspiciousData.accessJti}`;
  await redis.client.del(suspiciousKey);
  await redis.client.del(accessJtiKey);

  console.log(
    `[Suspicious Token] Blacklisted for user ${userId}, tokenId: ${tokenId}`
  );
}

/**
 * Kiểm tra xem access token có phải là suspicious không
 * @param accessJti - Access token JTI
 */
export async function isAccessTokenSuspicious(
  accessJti: string
): Promise<boolean> {
  const accessJtiKey = `suspicious_access_jti:${accessJti}`;
  const exists = await redis.client.exists(accessJtiKey);
  return exists === 1;
}

/**
 * Kiểm tra xem refresh token có phải là suspicious không
 * @param refreshJti - Refresh token JTI
 */
export async function isRefreshTokenSuspicious(
  userId: string,
  refreshJti: string
): Promise<boolean> {
  const redisKey = `suspicious_token:${userId}:${refreshJti}`;
  const exists = await redis.client.exists(redisKey);
  return exists === 1;
}

