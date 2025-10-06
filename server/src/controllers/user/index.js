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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCtrl = void 0;
const express_validator_1 = require("express-validator");
const request_validation_error_1 = require("../../errors/request_validation_error");
const not_authorized_error_1 = require("../../errors/not_authorized_error");
const user_1 = require("../../services/user");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new request_validation_error_1.RequestValidationError(errors.array());
        }
        const { email, password } = req.body;
        const user = yield user_1.userSrv.localLogin({ email, password });
        res.status(200).json(user);
    });
}
function getCurrentUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        if (!user) {
            throw new not_authorized_error_1.NotAuthorizedError();
        }
        res.status(200).json(user);
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        req.session = null;
        res.status(200).json({});
    });
}
function updateProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // @ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { name, bio } = req.body;
        const updatedUser = yield user_1.userSrv.updateProfile(userId, {
            name,
            bio,
        });
        res.status(200).json(updatedUser);
    });
}
function updateTargetScore(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // @ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { reading, listening } = req.body;
        const updatedUser = yield user_1.userSrv.updateTargetScore(userId, {
            reading,
            listening,
        });
        res.status(200).json(updatedUser);
    });
}
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield user_1.userSrv.getAllUsers();
        res.status(200).json(users);
    });
}
function getUpgradeUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield user_1.userSrv.getUpgradeUsers();
        res.status(200).json(users);
    });
}
function getNewUserAnalyst(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { step, num } = req.query;
        const data = yield user_1.userSrv.getNewUserAnalyst(Number(step), Number(num));
        res.status(200).json(data);
    });
}
function getUpgradeUserAnalyst(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { step, num } = req.query;
        const data = yield user_1.userSrv.getUpgradeUserAnalyst(Number(step), Number(num));
        res.status(200).json(data);
    });
}
function getUserProgressAnalyst(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield user_1.userSrv.getUserProgressAnalyst();
        res.status(200).json(data);
    });
}
exports.userCtrl = {
    logout,
    getCurrentUser,
    updateProfile,
    updateTargetScore,
    getAllUsers,
    getUpgradeUsers,
    getNewUserAnalyst,
    getUpgradeUserAnalyst,
    getUserProgressAnalyst,
};
