"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
const custom_error_1 = require("./custom_error");
class DatabaseConnectionError extends custom_error_1.CustomError {
    constructor() {
        super("Connecting error");
        this.statusCode = 500;
        this.reason = "Error connecting to databasse";
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeError() {
        return [{ message: this.reason }];
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
