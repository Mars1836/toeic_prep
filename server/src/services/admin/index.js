"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLocalCreate = adminLocalCreate;
exports.adminLocalLogin = adminLocalLogin;
exports.adminGetById = adminGetById;
const user_model_1 = require("../../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const const_1 = require("../../configs/const");
const bad_request_error_1 = require("../../errors/bad_request_error");
function adminLocalCreate(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkEmail = yield user_model_1.userModel.findOne({
            email: data.email,
            role: "admin",
        });
        if (checkEmail) {
            throw new bad_request_error_1.BadRequestError("Email in use");
        }
        data.password = yield bcryptjs_1.default.hash(data.password, parseInt(const_1.constEnv.passwordSalt));
        data.role = "admin";
        // Store hash in your password DB.
        const user = yield user_model_1.userModel.create(data);
        return user;
    });
}
function adminLocalLogin(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.userModel.findOne({
            email: data.email,
            role: "admin",
        });
        if (!user) {
            throw new bad_request_error_1.BadRequestError("Email or password is wrong");
        }
        const verify = yield bcryptjs_1.default.compare(data.password, user.password);
        if (!verify) {
            throw new bad_request_error_1.BadRequestError("Email or password is wrong");
        }
        return user;
    });
}
function adminGetById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.userModel.findById(id).select("-password");
        return user;
    });
}
