"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = void 0;
const custom_error_1 = require("./custom_error");
class InternalError extends custom_error_1.CustomError {
    constructor(message = "Something wrong in server") {
        super(message);
        this.statusCode = 500;
        Object.setPrototypeOf(this, InternalError.prototype);
    }
    serializeError() {
        return [{ message: this.message }];
    }
}
exports.InternalError = InternalError;
