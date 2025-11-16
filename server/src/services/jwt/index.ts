import jwt from "jsonwebtoken";
import { constEnv } from "../../configs/const";
import { redis } from "../../connect/redis";

export interface UserPayload {
  id: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
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
 */
export function generateAccessToken(payload: UserPayload): string {
  if (!constEnv.jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(payload, constEnv.jwtSecret, {
    expiresIn: ACCESS_TOKEN_EXPIRE,
    issuer: "toeic-prep-server",
    audience: "toeic-prep-client",
  });
}

/**
 * Generate refresh token (long-lived) và lưu vào Redis
 */
export async function generateRefreshToken(
  payload: UserPayload
): Promise<string> {
  if (!constEnv.jwtRefreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }

  const refreshToken = jwt.sign(payload, constEnv.jwtRefreshSecret, {
    // jsonwebtoken đã hỗ trợ format "7d", "1h", "30m", "90s" sẵn, không cần parse
    expiresIn: REFRESH_TOKEN_TTL_STRING,
    issuer: "toeic-prep-server",
    audience: "toeic-prep-client",
  });

  // Lưu refresh token vào Redis với key là userId
  const redisKey = `refresh_token:${payload.id}`;
  await redis.client.set(redisKey, refreshToken, {
    EX: REFRESH_TOKEN_EXPIRE_SECONDS, // Expire theo config (seconds)
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
 * Verify refresh token và kiểm tra trong Redis
 */
export async function verifyRefreshToken(token: string): Promise<UserPayload> {
  if (!constEnv.jwtRefreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }

  try {
    const decoded = jwt.verify(token, constEnv.jwtRefreshSecret, {
      issuer: "toeic-prep-server",
      audience: "toeic-prep-client",
    }) as UserPayload;

    // Kiểm tra refresh token có trong Redis không
    const redisKey = `refresh_token:${decoded.id}`;
    const storedToken = await redis.client.get(redisKey);

    if (!storedToken || storedToken !== token) {
      throw new Error("Refresh token not found or invalid");
    }

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
 * Revoke refresh token (xóa khỏi Redis)
 */
export async function revokeRefreshToken(userId: string): Promise<void> {
  const redisKey = `refresh_token:${userId}`;
  await redis.client.del(redisKey);
}

/**
 * Revoke all refresh tokens của user (nếu cần)
 */
export async function revokeAllUserTokens(userId: string): Promise<void> {
  const redisKey = `refresh_token:${userId}`;
  await redis.client.del(redisKey);
}
