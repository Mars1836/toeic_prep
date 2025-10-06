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
exports.redisKey = exports.redis = void 0;
exports.connectRedis = connectRedis;
const client_1 = require("@redis/client");
class Redis {
    constructor() {
        this.client = (0, client_1.createClient)({ url: process.env.REDIS_LOCAL_URL }); // Initialize the client
        this.client.on("error", (err) => console.error("Redis Client Error", err));
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.quit(); // Disconnect from Redis server
                console.log("Disconnected from Redis");
            }
            catch (err) {
                console.error("Failed to disconnect from Redis", err);
            }
        });
    }
}
exports.redis = new Redis();
function connectRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.redis.client.connect(); // Connect to Redis server
            console.log("Connected to Redis");
        }
        catch (err) {
            console.error("Failed to connect to Redis", err);
        }
    });
}
function verifyEmailKey(email) {
    return "otp:vrf:" + email;
}
function resetPwOTPKey(email) {
    return "otp:pw:" + email;
}
exports.redisKey = {
    resetPwOTPKey,
    verifyEmailKey,
};
