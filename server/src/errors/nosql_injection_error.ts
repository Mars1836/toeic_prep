import { CustomError } from './custom_error';

/**
 * Error class cho NoSQL Injection attempts
 * Được throw khi phát hiện injection pattern trong request
 */
export class NoSqlInjectionError extends CustomError {
  statusCode = 400;

  constructor(public injectedKeys: string[]) {
    super('NoSQL injection attempt detected');
    
    // Restore prototype chain
    Object.setPrototypeOf(this, NoSqlInjectionError.prototype);
  }

  serializeError() {
    return [
      {
        message: 'Invalid input: suspected NoSQL injection pattern detected',
        field: 'request',
        details: {
          injectedKeys: this.injectedKeys,
          reason: 'Object keys cannot contain "$" or "." characters',
        },
      },
    ];
  }
}
