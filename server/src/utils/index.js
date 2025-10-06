"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
exports.generateMac = generateMac;
exports.getRateDiffDays = getRateDiffDays;
exports.getTimeLastNDays = getTimeLastNDays;
exports.cleanNullFieldObject = cleanNullFieldObject;
exports.getStartOfPeriod = getStartOfPeriod;
exports.formatDate = formatDate;
exports.transformId = transformId;
exports.getPaginationParams = getPaginationParams;
exports.getPaginationSkip = getPaginationSkip;
exports.createPaginatedResponse = createPaginatedResponse;
exports.createToken = createToken;
exports.verifyToken = verifyToken;
exports.decodeToken = decodeToken;
exports.calculateToeicScore = calculateToeicScore;
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = __importDefault(require("mongoose"));
__exportStar(require("./otp.generate"), exports);
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const toeic_1 = require("../const/toeic");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.delay = delay;
function generateMac(data, key) {
    return crypto_1.default
        .createHmac("sha256", key) // Sử dụng HMAC với SHA-256
        .update(data) // Cập nhật dữ liệu đầu vào
        .digest("hex"); // Chuyển đổi kết quả thành chuỗi hexa
}
function getDiffDays(optimalTime) {
    return ((new Date(optimalTime).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24));
}
function getRateDiffDays(learningFlashcard) {
    if (!learningFlashcard.optimalTime || !learningFlashcard.interval) {
        return 0.2;
    }
    // Tính số ngày khác biệt giữa optimalTime và ngày hiện tại
    const diffDays = getDiffDays(learningFlashcard.optimalTime);
    // Tính tỉ lệ giữa diffDays và interval
    let rate = diffDays / learningFlashcard.interval;
    // Nếu tỉ lệ không hợp lệ, gán rate = 0.2
    if (!isFinite(rate)) {
        rate = 0.2;
    }
    return rate;
}
function getTimeLastNDays(n) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const nDaysAgo = new Date();
    nDaysAgo.setDate(today.getDate() - n);
    nDaysAgo.setHours(0, 0, 0, 0);
    return { from: nDaysAgo, to: today };
}
function cleanNullFieldObject(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));
}
function getStartOfPeriod(date, step) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}
function formatDate(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
function transformId(data) {
    if (!data)
        return null;
    if (Array.isArray(data)) {
        return data.map((item) => transformId(item));
    }
    if (data instanceof mongoose_1.default.Document) {
        data = data.toObject();
    }
    const result = Object.assign({}, data);
    if (result._id) {
        result.id = result._id;
        delete result._id;
    }
    if (result.__v) {
        delete result.__v;
    }
    return result;
}
function getPaginationParams(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    return { page, limit };
}
function getPaginationSkip(params) {
    return (params.page - 1) * params.limit;
}
function createPaginatedResponse(data, total, params) {
    return {
        data,
        pagination: {
            total,
            page: params.page,
            limit: params.limit,
            totalPages: Math.ceil(total / params.limit),
        },
    };
}
function createToken(data, expiresIn) {
    return jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET_LOCAL, {
        expiresIn,
    });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_LOCAL);
}
function decodeToken(token) {
    return jsonwebtoken_1.default.decode(token, { json: true });
}
function calculateToeicScore(correctReading, correctListening) {
    // Ensure scores are within valid ranges
    const readingScore = Math.min(Math.max(correctReading, 0), 100);
    const listeningScore = Math.min(Math.max(correctListening, 0), 100);
    // Get scaled scores from the conversion tables
    const scaledReadingScore = toeic_1.readScore[readingScore] || 5;
    const scaledListeningScore = toeic_1.listenScore[listeningScore] || 5;
    // Calculate total score
    const totalScore = scaledReadingScore + scaledListeningScore;
    return {
        reading: scaledReadingScore,
        listening: scaledListeningScore,
        total: totalScore,
    };
}
