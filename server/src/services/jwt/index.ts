import jwt from "jsonwebtoken";
import { constEnv } from "../../configs/const";
import { redis } from "../../connect/redis";
import { v4 as uuidv4 } from "uuid";

export interface UserPayload {
  id: string;
  email: string;
  jti?: string; // JWT ID - unique identifier for each token
}

export interface RefreshTokenPayload extends UserPayload {
  jti: string; // Required for refresh tokens
}

export interface AccessTokenPayload extends UserPayload {
  jti: string; // Required for access tokens
  parentRefreshJti?: string; // JTI của refresh token tạo ra access token này
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Redis storage structure for refresh token
interface RefreshTokenData {
  userId: string;
  email: string;
  jti: string;
  iat: number; // issued at
  exp: number; // expiration
  usedCount: number; // Số lần token đã được sử dụng (0 = chưa dùng, 1 = đã dùng 1 lần)
  createdAt: string;
}

// Access token TTL - default 15 minutes if not configured
// jsonwebtoken đã hỗ trợ format s/m/h/d sẵn, không cần parse
const ACCESS_TOKEN_EXPIRE = constEnv.jwtAccessTokenTTL || "15m";

// Refresh token TTL string - default 7 days if not configured
// jsonwebtoken đã hỗ trợ format s/m/h/d sẵn (e.g., "7d", "1h", "30m", "90s")
const REFRESH_TOKEN_TTL_STRING = constEnv.jwtRefreshTokenTTL || "7d";

/**
 * Parse time format string (e.g., "7d", "1h", "30m", "90s") to seconds
 * Chỉ cần parse cho Redis vì Redis EX chỉ nhận số seconds, không nhận format string
 * jsonwebtoken đã hỗ trợ format này sẵn, không cần parse cho JWT
 */
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

    // **CRITICAL SECURITY CHECK: Reuse Detection**
    if (tokenData.usedCount > 0) {
      // Token đã được sử dụng rồi mà lại được dùng lần nữa
      // => Có thể token bị đánh cắp (token theft)
      // => Revoke TẤT CẢ tokens của user này
      console.error(
        `[SECURITY ALERT] Refresh token reuse detected! UserId: ${decoded.id}, JTI: ${decoded.jti}`
      );

      // Revoke all tokens của user ngay lập tức
      await revokeAllUserTokens(decoded.id);

      throw new Error(
        "Refresh token reuse detected. All tokens have been revoked for security."
      );
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
 * Mark refresh token as used (increment usedCount)
 * Sau khi verify thành công, mark token as used trước khi generate token mới
 */
export async function markRefreshTokenAsUsed(
  userId: string,
  jti: string
): Promise<void> {
  const redisKey = `refreshtoken:${userId}:${jti}`;
  const storedData = await redis.client.get(redisKey);

  if (!storedData) {
    throw new Error("Refresh token not found");
  }

  const tokenData: RefreshTokenData = JSON.parse(storedData);
  tokenData.usedCount += 1;

  // Update Redis với usedCount mới
  const ttl = await redis.client.ttl(redisKey);
  if (ttl > 0) {
    await redis.client.set(redisKey, JSON.stringify(tokenData), {
      EX: ttl, // Giữ nguyên TTL
    });
  }
}

/**
 * Revoke specific refresh token (xóa khỏi Redis)
 */
export async function revokeRefreshToken(
  userId: string,
  jti: string
): Promise<void> {
  const redisKey = `refreshtoken:${userId}:${jti}`;
  await redis.client.del(redisKey);

  // Xóa luôn access tokens tracking
  const trackingKey = `access_tokens:${userId}:${jti}`;
  await redis.client.del(trackingKey);
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
