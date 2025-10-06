"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constEnv = exports.ConstEnv = exports.envMappingLocal = void 0;
exports.envMappingLocal = {
    mongoUrl: "MONGO_LOCAL_URL",
    passwordSalt: "PASSWORD_SALTROUND",
    jwtSecret: "JWT_SECRET_LOCAL",
    redisUrl: "NAT_LOCAL_REDIS",
    googleClientId: "GOOGLE_CLIENT_ID",
    googleClientSecret: "GOOGLE_CLIENT_SECRET",
    clientOrigin: "CLIENT_ORIGIN",
    facebookClientSecret: "FACEBOOK_CLIENT_SECRET",
    facebookClientId: "FACEBOOK_CLIENT_ID",
    nodemailerUser: "NODEMAILER_USER",
    nodemailerPass: "NODEMAILER_PASS",
};
class ConstEnv {
    constructor() {
        this._const = {};
        this.mapping = exports.envMappingLocal;
    }
    setKey(key, custom) {
        try {
            const ref = custom || this.mapping[key];
            if (!process.env[ref]) {
                throw new Error(`Not found "${ref}" key in env`);
            }
            const value = process.env[ref];
            //@ts-ignore
            this._const[key] = value;
        }
        catch (error) {
            console.log(error);
        }
    }
    get const() {
        return this._const;
    }
}
exports.ConstEnv = ConstEnv;
const constIns = new ConstEnv();
constIns.setKey("jwtSecret");
constIns.setKey("mongoUrl");
constIns.setKey("passwordSalt");
constIns.setKey("googleClientId");
constIns.setKey("googleClientSecret");
constIns.setKey("clientOrigin");
constIns.setKey("facebookClientId");
constIns.setKey("facebookClientSecret");
constIns.setKey("nodemailerUser");
constIns.setKey("nodemailerPass");
exports.constEnv = constIns.const;
