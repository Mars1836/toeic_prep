"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const env = process.env.APP_ENV;
const envFile = process.env.ENV_FILE;
if (envFile) {
    dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), envFile) });
}
else {
    dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), `.env.${env}`) });
}
