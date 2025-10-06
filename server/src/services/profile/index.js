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
const result_item_model_1 = require("../../models/result_item.model");
const average_time_1 = require("../../utils/analyst/average_time");
const category_accuracy_1 = require("../../utils/analyst/category_accuracy");
const part_accuracy_1 = require("../../utils/analyst/part_accuracy");
const score_1 = require("../../utils/analyst/score");
const toeic_1 = require("../../const/toeic");
const recommend_1 = require("../recommend");
var ProfileService;
(function (ProfileService) {
    ProfileService.getAnalyst = (userId) => __awaiter(this, void 0, void 0, function* () {
        const rs = yield result_item_model_1.resultItemModel
            .find({
            userId: userId,
        })
            .lean();
        const accuracyByPart = (0, part_accuracy_1.calculateAccuracyByPart)(rs);
        const averageTimeByPart = (0, average_time_1.calculateAverageTimeByPart)(rs);
        const categoryAccuracy = (0, category_accuracy_1.calculateCategoryAccuracy)(rs);
        const { listenScore, readScore, score } = (0, score_1.getScoreByAccuracy)(accuracyByPart);
        return {
            accuracyByPart,
            averageTimeByPart,
            categoryAccuracy,
            listenScore,
            readScore,
            score,
            timeSecondRecommend: toeic_1.timeSecondRecommend,
        };
    });
    ProfileService.getSuggestForStudy = (userId) => __awaiter(this, void 0, void 0, function* () {
        const lastRecommend = yield (0, recommend_1.getLastRecommend)(userId);
        return lastRecommend;
    });
})(ProfileService || (ProfileService = {}));
exports.default = ProfileService;
