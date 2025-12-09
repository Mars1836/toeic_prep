/**
 * Login History & Anomaly Detection Service
 *
 * Track lịch sử login và detect các hoạt động bất thường:
 * - Login từ device mới
 * - Login từ IP mới
 * - Login từ location mới
 */

import { redis } from "../../connect/redis";
import {
  DeviceInfo,
  formatDeviceInfo,
  isSameDevice,
  isSimilarIP,
} from "../device_fingerprint";
import geoip from "geoip-lite";

// Simple logger wrapper (using console for now)
const logger = {
  info: (...args: any[]) => console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
};

export interface LoginRecord {
  fingerprint: string;
  ip: string;
  location: string; // "City, Country" or "Unknown"
  browser: string;
  os: string;
  device: string;
  timestamp: number;
  success: boolean;
}

export interface AnomalyDetectionResult {
  isAnomalous: boolean;
  reasons: string[]; // Lý do cảnh báo
  riskLevel: "low" | "medium" | "high";
  shouldRequireVerification: boolean;
}

const MAX_LOGIN_HISTORY = 10; // Giữ 10 login gần nhất
const LOGIN_HISTORY_KEY_PREFIX = "login_history:";

/**
 * Lưu login record vào Redis (LPUSH + LTRIM để giữ N records gần nhất)
 */
export async function saveLoginRecord(
  userId: string,
  device: DeviceInfo,
  success: boolean
): Promise<void> {
  const location = getLocationFromIP(device.ip);

  const record: LoginRecord = {
    fingerprint: device.fingerprint,
    ip: device.ip,
    location,
    browser: device.browser,
    os: device.os,
    device: device.device,
    timestamp: Date.now(),
    success,
  };

  const key = `${LOGIN_HISTORY_KEY_PREFIX}${userId}`;

  try {
    // LPUSH: Thêm vào đầu list (newest first)
    await redis.client.lPush(key, JSON.stringify(record));

    // LTRIM: Chỉ giữ MAX_LOGIN_HISTORY records gần nhất
    await redis.client.lTrim(key, 0, MAX_LOGIN_HISTORY - 1);

    // Set TTL 90 ngày
    await redis.client.expire(key, 90 * 24 * 60 * 60);

    logger.info(`[Login History] Saved for user ${userId}:`, {
      device: formatDeviceInfo(device),
      location,
      success,
    });
  } catch (error) {
    logger.error("[Login History] Error saving record:", error);
    // Không throw error để không ảnh hưởng login flow
  }
}

/**
 * Lấy lịch sử login của user
 */
export async function getLoginHistory(userId: string): Promise<LoginRecord[]> {
  const key = `${LOGIN_HISTORY_KEY_PREFIX}${userId}`;

  try {
    const records = await redis.client.lRange(key, 0, -1);
    return records.map((r: string) => JSON.parse(r) as LoginRecord);
  } catch (error) {
    logger.error("[Login History] Error getting history:", error);
    return [];
  }
}

/**
 * Phát hiện login bất thường bằng cách so sánh với lịch sử
 */
export async function detectAnomalousLogin(
  userId: string,
  currentDevice: DeviceInfo
): Promise<AnomalyDetectionResult> {
  const history = await getLoginHistory(userId);

  // Nếu chưa có lịch sử (user mới), không coi là anomaly
  if (history.length === 0) {
    return {
      isAnomalous: false,
      reasons: [],
      riskLevel: "low",
      shouldRequireVerification: false,
    };
  }

  const reasons: string[] = [];
  let riskLevel: "low" | "medium" | "high" = "low";

  // Lọc ra các successful logins để compare
  const successfulLogins = history.filter((h) => h.success);

  if (successfulLogins.length === 0) {
    // Nếu chưa có successful login nào, không check anomaly
    return {
      isAnomalous: false,
      reasons: [],
      riskLevel: "low",
      shouldRequireVerification: false,
    };
  }

  // Check 1: Device fingerprint mới (chưa từng thấy)
  const knownFingerprints = new Set(successfulLogins.map((h) => h.fingerprint));
  if (!knownFingerprints.has(currentDevice.fingerprint)) {
    reasons.push("New device detected");
    riskLevel = "medium";
  }

  // Check 2: IP mới (không giống bất kỳ IP nào trong history)
  const hasKnownIP = successfulLogins.some((h) =>
    isSimilarIP(h.ip, currentDevice.ip)
  );
  if (!hasKnownIP) {
    reasons.push("New IP address detected");
    riskLevel = riskLevel === "medium" ? "high" : "medium";
  }

  // Check 3: Location mới
  const currentLocation = getLocationFromIP(currentDevice.ip);
  const knownLocations = new Set(successfulLogins.map((h) => h.location));
  if (currentLocation !== "Unknown" && !knownLocations.has(currentLocation)) {
    reasons.push(`New location detected: ${currentLocation}`);
    riskLevel = "medium";
  }

  // Check 4: OS/Browser hoàn toàn khác (suspicious)
  const knownBrowsers = new Set(successfulLogins.map((h) => h.browser));
  const knownOSs = new Set(successfulLogins.map((h) => h.os));
  const browserChanged = !knownBrowsers.has(currentDevice.browser);
  const osChanged = !knownOSs.has(currentDevice.os);

  if (browserChanged && osChanged) {
    reasons.push("Different browser and operating system");
    riskLevel = "high";
  }

  // Check 5: Login quá nhanh sau lần login cuối (impossible travel)
  const lastLogin = successfulLogins[0];
  const timeSinceLastLogin = Date.now() - lastLogin.timestamp;
  const lastLocation = lastLogin.location;

  if (
    timeSinceLastLogin < 30 * 60 * 1000 && // < 30 phút
    currentLocation !== lastLocation &&
    currentLocation !== "Unknown" &&
    lastLocation !== "Unknown"
  ) {
    reasons.push("Impossible travel detected (location changed too quickly)");
    riskLevel = "high";
  }

  const isAnomalous = reasons.length > 0;
  const shouldRequireVerification = riskLevel === "high" || reasons.length >= 2;

  // Debug log cho toàn bộ kết quả (giúp quan sát trong quá trình phát triển/demo)
  console.log("[Anomaly Detection][Result]", {
    userId,
    isAnomalous,
    reasons,
    riskLevel,
    currentDevice: formatDeviceInfo(currentDevice),
    currentLocation,
  });

  if (isAnomalous) {
    logger.warn(`[Anomaly Detection] User ${userId}:`, {
      reasons,
      riskLevel,
      currentDevice: formatDeviceInfo(currentDevice),
      currentLocation,
    });
  }

  return {
    isAnomalous,
    reasons,
    riskLevel,
    shouldRequireVerification,
  };
}

/**
 * Lấy location từ IP address sử dụng geoip-lite
 */
function getLocationFromIP(ip: string): string {
  // Bỏ qua localhost và private IPs
  if (
    ip === "unknown" ||
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return "Unknown";
  }

  const geo = geoip.lookup(ip);
  if (!geo) {
    return "Unknown";
  }

  return `${geo.city || "Unknown City"}, ${geo.country}`;
}

/**
 * Clear login history (dùng khi user đổi password hoặc revoke all sessions)
 */
export async function clearLoginHistory(userId: string): Promise<void> {
  const key = `${LOGIN_HISTORY_KEY_PREFIX}${userId}`;
  await redis.client.del(key);
  logger.info(`[Login History] Cleared for user ${userId}`);
}

/**
 * Thêm device vào trusted list (sau khi user confirm email)
 * - Cách implement: Lưu 1 successful login record với device đó
 */
export async function trustDevice(
  userId: string,
  device: DeviceInfo
): Promise<void> {
  await saveLoginRecord(userId, device, true);
  logger.info(`[Login History] Device trusted for user ${userId}:`, {
    device: formatDeviceInfo(device),
  });
}
