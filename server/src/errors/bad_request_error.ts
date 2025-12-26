import { CustomError } from "./custom_error";

export class BadRequestError extends CustomError {
  statusCode: number = 400;
  code?: string;
  
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  
  serializeError(): { message: string; field?: string; code?: string }[] {
    return [
      {
        message: this.message,
        ...(this.code && { code: this.code }),
      },
    ];
  }
}
