"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("@google-cloud/storage");
const path_1 = __importDefault(require("path"));
const storage = new storage_1.Storage({
    keyFilename: path_1.default.join(__dirname, 'path/to/your-service-account-file.json'),
});
const bucket = storage.bucket('your-bucket-name');
