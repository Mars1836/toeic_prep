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
exports.passportA = exports.passportU = void 0;
//@ts-nocheck
const passport_1 = require("passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_local_1 = require("passport-local");
const user_model_1 = require("../models/user.model");
const const_1 = require("./const");
const user_1 = require("../services/user");
const admin_1 = require("../services/admin");
exports.passportU = new passport_1.Passport();
exports.passportA = new passport_1.Passport();
exports.passportU.use(new passport_google_oauth20_1.Strategy({
    clientID: const_1.constEnv.googleClientId,
    clientSecret: const_1.constEnv.googleClientSecret,
    callbackURL: "/api/user/auth/google-login/callback",
    scope: ["profile", "email"],
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const user = {
            id: profile.id,
            name: profile.displayName,
            email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
            avatar: profile._json.picture, // Google profile picture URL
        };
        if (!user.email) {
            throw new Error("Can not get email");
        }
        const userExisted = yield user_model_1.userModel.findOne({
            email: user.email,
        });
        if (userExisted) {
            if (!userExisted.googleId) {
                userExisted.set({ googleId: user.id });
                yield userExisted.save();
                return done(null, userExisted);
            }
            if (userExisted.googleId === user.id) {
                return done(null, userExisted);
            }
        }
        const createUser = yield user_1.userSrv.googleCreate({
            name: user.name,
            googleId: user.id,
            email: user.email,
        });
        // Ở đây, bạn có thể lưu thông tin người dùng vào cơ sở dữ liệu
        return done(null, createUser);
    });
}));
exports.passportU.use(new passport_facebook_1.Strategy({
    clientID: const_1.constEnv.facebookClientId,
    clientSecret: const_1.constEnv.facebookClientSecret,
    callbackURL: "/api/user/auth/facebook-login/callback",
    profileFields: ["id", "displayName", "emails", "photos"], // Specify the fields you want to get
    scope: ["email"],
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // Extract user information
        const user = {
            id: profile.id,
            name: profile.displayName,
            email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value, // Safely access email
            avatar: profile._json.picture.data.url, // Facebook profile picture URL
        };
        if (!user.email) {
            throw new Error("Can not get email");
        }
        const userExisted = yield user_model_1.userModel.findOne({
            email: user.email,
        });
        if (userExisted) {
            if (!userExisted.facebookId) {
                userExisted.set({ facebookId: user.id });
                yield userExisted.save();
                return done(null, userExisted);
            }
            if (userExisted.facebookId === user.id) {
                console.log("userExisted", userExisted);
                return done(null, userExisted);
            }
        }
        else {
            const createUser = yield user_model_1.userModel.create({
                name: user.name,
                facebookId: user.id,
                email: user.email,
            });
            return done(null, createUser);
        }
        return done(null, user);
    });
}));
exports.passportU.use("local", new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, function (email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.userSrv.localLogin({
                email,
                password,
            });
            return done(null, user);
        }
        catch (error) {
            return done(error, false);
        }
        // Xử lý logic xác thực cho local
    });
}));
// Serialize và deserialize user để lưu thông tin vào session
exports.passportU.serializeUser(function (user, done) {
    done(null, user);
});
exports.passportU.deserializeUser(function (obj, done) {
    done(null, obj);
});
// passport for admin
exports.passportA.use("local", new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, function (email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        // Xử lý logic xác thực cho client
        try {
            const user = yield (0, admin_1.adminLocalLogin)({ email, password });
            return done(null, user);
        }
        catch (error) {
            return done(error, false);
        }
    });
}));
// Serialize và deserialize user để lưu thông tin vào session
exports.passportA.serializeUser(function (user, done) {
    done(null, user);
});
exports.passportA.deserializeUser(function (obj, done) {
    done(null, obj);
});
