import { CustomError } from "./custom_error";

export class PendingVerificationError extends CustomError {
  statusCode = 403;

  constructor() {
    super("Account verification required detected unusual login activity");
    Object.setPrototypeOf(this, PendingVerificationError.prototype);
  }

  serializeError() {
    return [
      {
        message: "We detected unusual activity. Please check your email to verify your login.",
        code: "TOKEN001",
      },
    ];
  }
}
