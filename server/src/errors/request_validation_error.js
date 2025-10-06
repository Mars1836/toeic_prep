"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const custom_error_1 = require("./custom_error");
class RequestValidationError extends custom_error_1.CustomError {
    constructor(errors) {
        super("Invalid request data");
        this.errors = errors;
        this.statusCode = 400;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeError() {
        const formatErrors = this.errors.map((_x) => {
            return {
                message: _x.msg,
            };
        });
        return formatErrors;
    }
}
exports.RequestValidationError = RequestValidationError;
