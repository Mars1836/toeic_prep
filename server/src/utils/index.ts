import crypto from "crypto";
export * from "./otp.generate";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export function generateMac(data: string, key: string) {
  return crypto
    .createHmac("sha256", key) // Sử dụng HMAC với SHA-256
    .update(data) // Cập nhật dữ liệu đầu vào
    .digest("hex"); // Chuyển đổi kết quả thành chuỗi hexa
}
