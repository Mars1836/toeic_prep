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
const learning_set_1 = __importDefault(require("../../services/learning_set"));
var LearningSetCtl;
(function (LearningSetCtl) {
    function addSetToLearn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            //@ts-ignore
            data.userId = req.user.id;
            const setFlashcard = yield learning_set_1.default.addSetToLearn(data);
            res.status(200).json(setFlashcard);
        });
    }
    LearningSetCtl.addSetToLearn = addSetToLearn;
    function removeSetFromLearn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { learningSetId } = req.body;
            //@ts-ignore
            const userId = req.user.id;
            const rs = yield learning_set_1.default.removeSetFromLearn(userId, learningSetId);
            res.status(200).json(rs);
        });
    }
    LearningSetCtl.removeSetFromLearn = removeSetFromLearn;
    function getLearningSetByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            const userId = req.user.id;
            const rs = yield learning_set_1.default.getLearningSetByUser(userId);
            res.status(200).json(rs);
        });
    }
    LearningSetCtl.getLearningSetByUser = getLearningSetByUser;
    function getLearningSetBySetId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { setFlashcardId } = req.query;
            const rs = yield learning_set_1.default.getLearningSetBySetId(setFlashcardId);
            res.status(200).json(rs);
        });
    }
    LearningSetCtl.getLearningSetBySetId = getLearningSetBySetId;
    function getLearningSetById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            const rs = yield learning_set_1.default.getLearningSetById(id);
            res.status(200).json(rs);
        });
    }
    LearningSetCtl.getLearningSetById = getLearningSetById;
})(LearningSetCtl || (LearningSetCtl = {}));
exports.default = LearningSetCtl;
