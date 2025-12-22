import { CustomError } from "./custom_error";

export class NotAuthorizedError extends CustomError {
  public statusCode: number = 401;
  constructor(message: string = "Not authorized") {
    super(message);
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeError(): { message: string; field?: string }[] {
    return [
      {
        message: this.message,
      },
    ];
  }
}
