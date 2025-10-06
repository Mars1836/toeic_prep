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
exports.AdminCtrl = void 0;
const express_validator_1 = require("express-validator");
const request_validation_error_1 = require("../../errors/request_validation_error");
const not_authorized_error_1 = require("../../errors/not_authorized_error");
const admin_1 = require("../../services/admin");
var AdminCtrl;
(function (AdminCtrl) {
    function localLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new request_validation_error_1.RequestValidationError(errors.array());
            }
            const { email, password } = req.body;
            const user = yield (0, admin_1.adminLocalLogin)({ email, password });
            res.status(200).json(user);
        });
    }
    AdminCtrl.localLogin = localLogin;
    function localRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new request_validation_error_1.RequestValidationError(errors.array());
            }
            const { email, password, name } = req.body;
            const user = yield (0, admin_1.adminLocalCreate)({ email, password, name });
            res.status(200).json(user);
        });
    }
    AdminCtrl.localRegister = localRegister;
    function getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            if (!user) {
                throw new not_authorized_error_1.NotAuthorizedError();
            }
            res.status(200).json(user);
        });
    }
    AdminCtrl.getCurrentUser = getCurrentUser;
    function logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.session = null;
            res.status(200).json({});
        });
    }
    AdminCtrl.logout = logout;
})(AdminCtrl || (exports.AdminCtrl = AdminCtrl = {}));
