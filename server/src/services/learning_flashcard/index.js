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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const learning_flashcard_1 = require("../../models/learning_flashcard");
const learning_set_model_1 = require("../../models/learning_set.model");
const repos_1 = __importDefault(require("./repos"));
var LearningFlashcardSrv;
(function (LearningFlashcardSrv) {
    // Add a set to the user's learning list
    function getByLearningSet(learningSetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield learning_flashcard_1.learningFlashcardModel
                .find({
                learningSetId: learningSetId,
            })
                .populate("flashcardId")
                .sort({ createdAt: -1 });
            if (!result) {
                throw new Error("Set not found in the learning list.");
            }
            return result;
        });
    }
    LearningFlashcardSrv.getByLearningSet = getByLearningSet;
    function updateShortTermScore(learningFlashcardId, score) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield learning_flashcard_1.learningFlashcardModel.findByIdAndUpdate({ _id: learningFlashcardId }, {
                shortTermScore: score,
            }, { new: true });
            return result;
        });
    }
    LearningFlashcardSrv.updateShortTermScore = updateShortTermScore;
    function updateSessionScore(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const a = yield Promise.all(data.map((item) => {
                return repos_1.default.updateScore(item);
            }));
            const learningFlashcard = yield learning_flashcard_1.learningFlashcardModel.findById(data[0].id);
            if (!learningFlashcard) {
                throw new Error("Learning flashcard not found");
            }
            const set = yield learning_set_model_1.learningSetModel.findOneAndUpdate({ _id: learningFlashcard.learningSetId }, { lastStudied: new Date() }, { new: true });
            if (!set) {
                throw new Error("Learning set not found");
            }
            set.lastStudied = new Date();
            yield set.save();
            return a;
        });
    }
    LearningFlashcardSrv.updateSessionScore = updateSessionScore;
})(LearningFlashcardSrv || (LearningFlashcardSrv = {}));
exports.default = LearningFlashcardSrv;
