"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
// Tiến hành cấu hình Google Cloud API với tệp service account
const { SpeechClient } = require("@google-cloud/speech");
exports.client = new SpeechClient();
