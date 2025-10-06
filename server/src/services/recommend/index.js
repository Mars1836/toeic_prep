"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastRecommend = getLastRecommend;
exports.createRecommend = createRecommend;
const recommend_1 = require("../../models/recommend");
function getLastRecommend(userId) {
    return recommend_1.recommendModel.findOne({ userId }).sort({ createdAt: -1 });
}
function createRecommend({ userId, content, targetScore, }) {
    return recommend_1.recommendModel.create({ userId, content, targetScore });
}
