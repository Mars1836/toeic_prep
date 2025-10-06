"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const custom_error_1 = require("./custom_error");
class NotFoundError extends custom_error_1.CustomError {
    serializeError() {
        return [
            {
                message: this.message,
            },
        ];
    }
    constructor(message) {
        super("Not found");
        this.statusCode = 404;
        this.message = "API endpoint not found";
        if (message) {
            this.message = message;
        }
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
exports.NotFoundError = NotFoundError;
