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
const learning_flashcard_1 = __importDefault(require("../../services/learning_flashcard"));
var LearningFlashcardCtl;
(function (LearningFlashcardCtl) {
    function getByLearningSet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { learningSetId } = req.query;
            const set = yield learning_flashcard_1.default.getByLearningSet(learningSetId);
            res.status(200).json(set);
        });
    }
    LearningFlashcardCtl.getByLearningSet = getByLearningSet;
    function updateShortTermScore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { learningFlashcardId, score } = req.body;
            const updated = yield learning_flashcard_1.default.updateShortTermScore(learningFlashcardId, score);
            res.status(200).json(updated);
        });
    }
    LearningFlashcardCtl.updateShortTermScore = updateShortTermScore;
    function updateSessionScore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const rs = yield learning_flashcard_1.default.updateSessionScore(data);
            res.status(200).json(rs);
        });
    }
    LearningFlashcardCtl.updateSessionScore = updateSessionScore;
})(LearningFlashcardCtl || (LearningFlashcardCtl = {}));
exports.default = LearningFlashcardCtl;
