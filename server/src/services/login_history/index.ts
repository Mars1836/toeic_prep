/**
 * Login History & Anomaly Detection Service
 *
 * Track lịch sử login và detect các hoạt động bất thường:
 * - Login từ device mới
 * - Login từ IP mới
 * - Login từ location mới
 * 
 * STORAGE: MongoDB (unlimited history)
 */

import {
  DeviceInfo,
  formatDeviceInfo,
  isSameDevice,
  isSimilarIP,
} from "../device_fingerprint";
import geoip from "geoip-lite";
import { LoginHistory, LoginHistoryAttr } from "../../models/login_history.model";

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

// Configuration
const HISTORY_QUERY_LIMIT = 50; // Query 50 recent logins for anomaly detection
const HISTORY_DAYS_BACK = 90; // Look back 90 days for history

/**
 * Lưu login record vào MongoDB
 */
export async function saveLoginRecord(
  userId: string,
  device: DeviceInfo,
  success: boolean
): Promise<void> {
  const location = getLocationFromIP(device.ip);

  const record: LoginHistoryAttr = {
    userId,
    fingerprint: device.fingerprint,
    ip: device.ip,
    location,
    browser: device.browser,
    os: device.os,
    device: device.device,
    success,
    timestamp: new Date(),
  };

  try {
    await LoginHistory.create(record);

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
 * Lấy lịch sử login của user (recent logins)
 * @param userId User ID
 * @param limit Number of records to fetch (default: 50)
 * @param daysBack Number of days to look back (default: 90)
 */
export async function getLoginHistory(
  userId: string,
  limit: number = HISTORY_QUERY_LIMIT,
  daysBack: number = HISTORY_DAYS_BACK
): Promise<LoginRecord[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const records = await LoginHistory.find({
      userId,
      timestamp: { $gte: startDate },
    })
      .sort({ timestamp: -1 }) // Newest first
      .limit(limit)
      .lean();

    return records.map((r) => ({
      fingerprint: r.fingerprint,
      ip: r.ip,
      location: r.location,
      browser: r.browser,
      os: r.os,
      device: r.device,
      timestamp: r.timestamp.getTime(),
      success: r.success,
    }));
  } catch (error) {
    logger.error("[Login History] Error getting history:", error);
    return [];
  }
}

/**
 * Lấy recent successful logins (for anomaly detection)
 */
export async function getRecentSuccessfulLogins(
  userId: string,
  limit: number = HISTORY_QUERY_LIMIT,
  daysBack: number = HISTORY_DAYS_BACK
): Promise<LoginRecord[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const records = await LoginHistory.find({
      userId,
      success: true,
      timestamp: { $gte: startDate },
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return records.map((r) => ({
      fingerprint: r.fingerprint,
      ip: r.ip,
      location: r.location,
      browser: r.browser,
      os: r.os,
      device: r.device,
      timestamp: r.timestamp.getTime(),
      success: r.success,
    }));
  } catch (error) {
    logger.error("[Login History] Error getting successful logins:", error);
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
  // Query successful logins from history
  const successfulLogins = await getRecentSuccessfulLogins(userId);

  // Nếu chưa có lịch sử (user mới), không coi là anomaly
  if (successfulLogins.length === 0) {
    return {
      isAnomalous: false,
      reasons: [],
      riskLevel: "low",
      shouldRequireVerification: false,
    };
  }

  const reasons: string[] = [];
  let riskLevel: "low" | "medium" | "high" = "low";

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
    historyCount: successfulLogins.length,
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
  try {
    const result = await LoginHistory.deleteMany({ userId });
    logger.info(`[Login History] Cleared ${result.deletedCount} records for user ${userId}`);
  } catch (error) {
    logger.error("[Login History] Error clearing history:", error);
  }
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

/**
 * Get login statistics for user
 */
export async function getLoginStats(userId: string, daysBack: number = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const stats = await LoginHistory.aggregate([
      {
        $match: {
          userId,
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalLogins: { $sum: 1 },
          successfulLogins: {
            $sum: { $cond: [{ $eq: ["$success", true] }, 1, 0] },
          },
          failedLogins: {
            $sum: { $cond: [{ $eq: ["$success", false] }, 1, 0] },
          },
          uniqueDevices: { $addToSet: "$fingerprint" },
          uniqueIPs: { $addToSet: "$ip" },
          uniqueLocations: { $addToSet: "$location" },
        },
      },
      {
        $project: {
          _id: 0,
          totalLogins: 1,
          successfulLogins: 1,
          failedLogins: 1,
          uniqueDeviceCount: { $size: "$uniqueDevices" },
          uniqueIPCount: { $size: "$uniqueIPs" },
          uniqueLocationCount: { $size: "$uniqueLocations" },
        },
      },
    ]);

    return stats[0] || {
      totalLogins: 0,
      successfulLogins: 0,
      failedLogins: 0,
      uniqueDeviceCount: 0,
      uniqueIPCount: 0,
      uniqueLocationCount: 0,
    };
  } catch (error) {
    logger.error("[Login History] Error getting stats:", error);
    return null;
  }
}
