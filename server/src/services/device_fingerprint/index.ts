/**
 * Device Fingerprinting Service
 *
 * Tạo unique fingerprint cho mỗi device/browser để detect login từ device lạ.
 * Fingerprint dựa trên: User-Agent, Accept-Language, IP, và các thông tin khác.
 */

import crypto from "crypto";
import { Request } from "express";
import * as UAParserLib from "ua-parser-js";

const UAParser = UAParserLib.UAParser || UAParserLib;

export interface DeviceInfo {
  fingerprint: string; // Unique device ID
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  ip: string;
  language?: string;
}

/**
 * Tạo device fingerprint từ request
 * @param req Express Request
 * @returns DeviceInfo object với fingerprint
 */
export function generateDeviceFingerprint(req: Request): DeviceInfo {
  const userAgent = req.headers["user-agent"] || "unknown";
  const acceptLanguage = req.headers["accept-language"] || "";
  const ip = getClientIP(req);

  // Parse User-Agent để lấy thông tin chi tiết
  // UAParser v2.x can be used as a function
  const result = UAParser(userAgent);

  // Tạo fingerprint từ các components
  const components = [
    userAgent,
    acceptLanguage,
    ip,
    result.browser.name || "",
    result.os.name || "",
    result.device.type || "desktop",
  ];

  const fingerprint = crypto
    .createHash("sha256")
    .update(components.join("|"))
    .digest("hex")
    .substring(0, 32); // Lấy 32 ký tự đầu

  return {
    fingerprint,
    userAgent,
    browser: `${result.browser.name || "Unknown"} ${
      result.browser.version || ""
    }`.trim(),
    os: `${result.os.name || "Unknown"} ${result.os.version || ""}`.trim(),
    device: result.device.type || "desktop",
    ip,
    language: acceptLanguage.split(",")[0], // Lấy language đầu tiên
  };
}

/**
 * Lấy client IP từ request (handle proxy/load balancer)
 */
function getClientIP(req: Request): string {
  // Thử các headers khác nhau (theo thứ tự ưu tiên)
  const forwardedFor = req.headers["x-forwarded-for"];
  const realIP = req.headers["x-real-ip"];
  const cfConnectingIP = req.headers["cf-connecting-ip"]; // Cloudflare

  if (forwardedFor) {
    // X-Forwarded-For có thể chứa nhiều IP, lấy IP đầu tiên
    const ips = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor.split(",")[0];
    return ips.trim();
  }

  if (realIP) {
    return Array.isArray(realIP) ? realIP[0] : realIP;
  }

  if (cfConnectingIP) {
    return Array.isArray(cfConnectingIP) ? cfConnectingIP[0] : cfConnectingIP;
  }

  // Fallback to req.ip
  return req.ip || "unknown";
}

/**
 * Format device info thành string dễ đọc (cho email/log)
 */
export function formatDeviceInfo(device: DeviceInfo): string {
  return `${device.browser} on ${device.os} (${device.device}) from ${device.ip}`;
}

/**
 * So sánh 2 fingerprints có giống nhau không
 */
export function isSameDevice(
  fingerprint1: string,
  fingerprint2: string
): boolean {
  return fingerprint1 === fingerprint2;
}

/**
 * Kiểm tra xem IP có thay đổi đáng kể không
 * (Cho phép thay đổi trong cùng subnet /24)
 */
export function isSimilarIP(ip1: string, ip2: string): boolean {
  if (ip1 === ip2) return true;

  // Chỉ so sánh 3 octets đầu cho IPv4
  const parts1 = ip1.split(".");
  const parts2 = ip2.split(".");

  if (parts1.length === 4 && parts2.length === 4) {
    return (
      parts1[0] === parts2[0] &&
      parts1[1] === parts2[1] &&
      parts1[2] === parts2[2]
    );
  }

  return false;
}
