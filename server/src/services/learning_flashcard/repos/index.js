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
const learning_flashcard_1 = require("../../../models/learning_flashcard");
const learning_set_model_1 = require("../../../models/learning_set.model");
const algorithms_score_flashcard_1 = require("../../../utils/algorithms_score_flashcard");
const DISTANCE_FACTOR = 2;
var LearningFlashcardRepo;
(function (LearningFlashcardRepo) {
    function createMany(data, userId, setFlashcardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const learningSet = yield learning_set_model_1.learningSetModel.findOne({
                setFlashcardId: setFlashcardId,
                userId,
            });
            if (!learningSet) {
                return null;
            }
            const learnignFlashcardData = data.map((item) => {
                return {
                    flashcardId: item.flashcardId,
                    learningSetId: learningSet.id,
                };
            });
            const rs = yield learning_flashcard_1.learningFlashcardModel.insertMany(learnignFlashcardData);
            return rs;
        });
    }
    LearningFlashcardRepo.createMany = createMany;
    function updateScore(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, difficult_rate, accuracy, timeMinutes } = data;
            const now = new Date();
            const Q = accuracy * 5;
            const learningFlashcard = yield learning_flashcard_1.learningFlashcardModel.findById(id);
            let t_actual = 0;
            if (!learningFlashcard) {
                throw new Error("Learning flashcard not found");
            }
            let last_studied;
            if (!learningFlashcard.lastStudied) {
                last_studied = null;
            }
            else {
                last_studied = new Date(learningFlashcard.lastStudied);
            }
            let algorithmsScoreFlashcard;
            if (!last_studied) {
                algorithmsScoreFlashcard = new algorithms_score_flashcard_1.AlgorithmsScoreFlashcard(1, 0, learningFlashcard.EF, Q, timeMinutes, accuracy, learningFlashcard.retentionScore || 1, learningFlashcard.interval || 0, difficult_rate);
            }
            else {
                t_actual =
                    (now.getTime() - last_studied.getTime()) / (1000 * 60 * 60 * 24);
                algorithmsScoreFlashcard = new algorithms_score_flashcard_1.AlgorithmsScoreFlashcard(learningFlashcard.studyTime + 1, t_actual, learningFlashcard === null || learningFlashcard === void 0 ? void 0 : learningFlashcard.EF, Q, timeMinutes, accuracy, learningFlashcard.retentionScore || 1, learningFlashcard.interval || 0, difficult_rate);
            }
            let isCountNextOptimalTime = false;
            if (!learningFlashcard.interval ||
                (t_actual && t_actual / (learningFlashcard.interval || 0.1) > 0.8)) {
                isCountNextOptimalTime = true;
            }
            const optimalDateNext = new Date(now.getTime() +
                algorithmsScoreFlashcard.calculateOptimalTime() * 1000 * 60 * 60 * 24);
            const newLearningFlashcard = yield learning_flashcard_1.learningFlashcardModel.findByIdAndUpdate(id, {
                studyTime: learningFlashcard.studyTime + 1,
                lastStudied: now,
                EF: algorithmsScoreFlashcard.calculateEF(),
                retentionScore: algorithmsScoreFlashcard.calculateMemoryRetention(),
                decayScore: algorithmsScoreFlashcard.calculateDecay(),
                optimalTime: isCountNextOptimalTime
                    ? optimalDateNext
                    : learningFlashcard.optimalTime,
                interval: isCountNextOptimalTime
                    ? algorithmsScoreFlashcard.calculateOptimalTime()
                    : learningFlashcard.interval,
            });
            return newLearningFlashcard;
        });
    }
    LearningFlashcardRepo.updateScore = updateScore;
})(LearningFlashcardRepo || (LearningFlashcardRepo = {}));
exports.default = LearningFlashcardRepo;
