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
//@ts-nocheck
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../controllers/user");
const handle_async_1 = require("../../../middlewares/handle_async");
const require_auth_1 = require("../../../middlewares/require_auth");
const bad_request_error_1 = require("../../../errors/bad_request_error");
const const_1 = require("../../../configs/const");
const passport_1 = require("../../../configs/passport");
const validate_request_1 = require("../../../middlewares/validate_request");
const express_validator_1 = require("express-validator");
const redis_1 = require("../../../connect/redis");
const utils_1 = require("../../../utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = require("../../../configs/nodemailer");
const user_model_1 = require("../../../models/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const user_2 = require("../../../services/user");
const userAuthRouter = express_1.default.Router();
userAuthRouter.get("/login", (0, handle_async_1.handleAsync)(require_auth_1.requireAuth), (req, res) => {
    res.json("Test success");
});
userAuthRouter.post("/signup", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email is required"),
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 4, max: 50 })
        .withMessage("Password must be between 4 and 50 characters"),
], (0, handle_async_1.handleAsync)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password } = req.body;
        const user = yield user_2.userSrv.localCreate({ name, email, password });
        res.status(200).json(user);
    });
}));
userAuthRouter.post("/local-signup-cache", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email is required"),
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 4, max: 50 })
        .withMessage("Password must be between 4 and 50 characters"),
], (0, handle_async_1.handleAsync)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password } = req.body;
        const userEx = yield user_model_1.userModel.findOne({ email });
        if (userEx) {
            throw new bad_request_error_1.BadRequestError("Email in use");
        }
        // const user = await userSrv.localCreate({ name, email, password });
        // res.status(200).json(user);
        const storeStr = JSON.stringify({ name, email, password });
        const key = new mongoose_1.default.Types.ObjectId().toString();
        yield redis_1.redis.client.set(key, storeStr, {
            EX: 60 * 60,
        });
        res.status(200).json({ key });
    });
}));
userAuthRouter.post("/login", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email must be valid"),
    (0, express_validator_1.body)("password").trim().notEmpty().withMessage("Password is required"),
], (0, handle_async_1.handleAsync)(validate_request_1.validate_request), passport_1.passportU.authenticate("local", {
    failureRedirect: "/failed",
}), function (req, res) {
    res.json(req.user);
});
userAuthRouter.get("/google-login", passport_1.passportU.authenticate("google"));
userAuthRouter.get("/google-login/callback", passport_1.passportU.authenticate("google"), function (req, res) {
    res.redirect(const_1.constEnv.clientOrigin);
});
userAuthRouter.get("/facebook-login", passport_1.passportU.authenticate("facebook"));
userAuthRouter.get("/facebook-login/callback", passport_1.passportU.authenticate("facebook"), function (req, res) {
    res.redirect(const_1.constEnv.clientOrigin);
});
userAuthRouter.post("/login/failed", (0, handle_async_1.handleAsync)(function (req, res) {
    throw new bad_request_error_1.BadRequestError("Username or password is wrong");
}));
userAuthRouter.get("/getinfor", (0, handle_async_1.handleAsync)(require_auth_1.requireAuth), (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_2.userSrv.getById(req.user.id);
    res.json(user);
})));
userAuthRouter.post("/logout", function (req, res) {
    req.session = null;
    res.json("1");
});
userAuthRouter.get("/current-user", (0, handle_async_1.handleAsync)(require_auth_1.requireAuth), (0, handle_async_1.handleAsync)(user_1.userCtrl.getCurrentUser));
userAuthRouter.post("/logout", (0, handle_async_1.handleAsync)(user_1.userCtrl.logout));
userAuthRouter.post("/otp/reset-password", [(0, express_validator_1.body)("email").isEmail().withMessage("Email is not provided or valid!")], (0, handle_async_1.handleAsync)(validate_request_1.validate_request), (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = (0, utils_1.generateOTP)();
    const { email } = req.body;
    const storeStr = JSON.stringify({ otp, email });
    yield redis_1.redis.client.del(redis_1.redisKey.resetPwOTPKey(email));
    const set = yield redis_1.redis.client.set(redis_1.redisKey.resetPwOTPKey(email), storeStr, {
        EX: 5 * 60,
    });
    yield (0, nodemailer_1.sendMailChangePW)({ otp: otp, to: email });
    res.status(200).json(1);
})));
userAuthRouter.post("/request/reset-password", [
    (0, express_validator_1.body)("password").trim().notEmpty().withMessage("Password is required"),
    (0, express_validator_1.body)("otp").trim().notEmpty().withMessage("OTP is required"),
], (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, otp, email } = req.body;
    const storeStr = yield redis_1.redis.client.get(redis_1.redisKey.resetPwOTPKey(email));
    if (!storeStr) {
        throw new bad_request_error_1.BadRequestError("OTP or email is not valid");
    }
    const store = JSON.parse(storeStr);
    if ((store === null || store === void 0 ? void 0 : store.email) !== email || (store === null || store === void 0 ? void 0 : store.otp) !== otp) {
        throw new bad_request_error_1.BadRequestError("OTP or email is not valid");
    }
    const user = yield user_model_1.userModel.findOne({
        email: email,
    });
    if (!user) {
        throw new bad_request_error_1.BadRequestError("Email is not valid");
    }
    const hashPassword = yield bcryptjs_1.default.hash(password, parseInt(const_1.constEnv.passwordSalt));
    user.set({
        password: hashPassword,
    });
    yield user.save();
    redis_1.redis.client.del(redis_1.redisKey.resetPwOTPKey(email));
    res.status(200).json(1);
})));
userAuthRouter.post("/otp/verify-email", [
    (0, express_validator_1.body)("key").notEmpty().withMessage("Key is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Email is required"),
], (0, handle_async_1.handleAsync)(validate_request_1.validate_request), (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, email } = req.body;
    const storeStr = yield redis_1.redis.client.get(key);
    if (!storeStr) {
        throw new bad_request_error_1.BadRequestError("Some thing wrong with key.");
    }
    const store = JSON.parse(storeStr);
    const otp = (0, utils_1.generateOTP)();
    store.otp = otp;
    redis_1.redis.client.del(redis_1.redisKey.verifyEmailKey(email));
    const set = yield redis_1.redis.client.set(redis_1.redisKey.verifyEmailKey(email), JSON.stringify(store), {
        EX: 5 * 60,
    });
    yield (0, nodemailer_1.sendMailVerifyEmail)({ otp: otp, to: email });
    res.status(200).json(1);
})));
userAuthRouter.post("/request/verify-email", [
    (0, express_validator_1.body)("otp").notEmpty().withMessage("OTP is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Email is required"),
], (0, handle_async_1.handleAsync)(validate_request_1.validate_request), (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const storeStr = yield redis_1.redis.client.get(redis_1.redisKey.verifyEmailKey(email));
    if (!storeStr) {
        throw new bad_request_error_1.BadRequestError("Email is not valid");
    }
    const store = JSON.parse(storeStr);
    if (store.otp !== otp) {
        throw new bad_request_error_1.BadRequestError("OTP is not valid");
    }
    if (store.password) {
        store.password = yield (0, user_2.hashPassword)(store.password);
    }
    const user = yield user_model_1.userModel.create(store);
    redis_1.redis.client.del(redis_1.redisKey.verifyEmailKey(email));
    yield new Promise((resolve, reject) => {
        req.login(user, (err) => {
            if (err) {
                return reject(err); // Reject if login fails
            }
            resolve(1); // Resolve if login is successful
        });
    });
    res.status(200).json(user);
})));
exports.default = userAuthRouter;
