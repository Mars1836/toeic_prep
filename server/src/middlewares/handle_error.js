"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
const custom_error_1 = require("../errors/custom_error");
function handleError(err, req, res, next) {
    if (err instanceof custom_error_1.CustomError) {
        return res.status(err.statusCode).json({ errors: err.serializeError() });
    }
    console.error(err);
    console.log(err.message);
    return res.status(400).json({
        errors: [{ message: err.message }],
    });
}
