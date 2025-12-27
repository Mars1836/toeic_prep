import { CustomError } from "./custom_error";

/**
 * Error thrown when refresh token reuse is detected
 * Indicates potential token theft - all user tokens will be revoked
 */
export class RefreshTokenReuseError extends CustomError {
  statusCode = 401;

  constructor(public userId: string, public jti: string) {
    super("Refresh token được sử dụng lại");
    Object.setPrototypeOf(this, RefreshTokenReuseError.prototype);
  }

  serializeError() {
    return [
      {
        message: "Refresh token được sử dụng lại. Tất cả phiên đăng nhập đã bị thu hồi vì lý do bảo mật.",
        code: "REFRESH_TOKEN_REUSE",
      },
    ];
  }
}
