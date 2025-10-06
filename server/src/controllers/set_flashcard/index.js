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
const set_flashcard_1 = __importDefault(require("../../services/set_flashcard"));
var SetFlashcardCtrl;
(function (SetFlashcardCtrl) {
    function create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            // @ts-ignore
            data.userId = req.user.id;
            const setFlashcard = yield set_flashcard_1.default.create(req.body);
            res.status(200).json(setFlashcard);
        });
    }
    SetFlashcardCtrl.create = create;
    function getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = {
                // @ts-ignore
                userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                id: req.query.id,
            };
            const rs = yield set_flashcard_1.default.getById(data);
            res.status(200).json(rs);
        });
    }
    SetFlashcardCtrl.getById = getById;
    function getByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const userId = req.user.id;
            const rs = yield set_flashcard_1.default.getByUser(userId);
            res.status(200).json(rs);
        });
    }
    SetFlashcardCtrl.getByUser = getByUser;
    function getPublic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield set_flashcard_1.default.getPublic();
            res.status(200).json(rs);
        });
    }
    SetFlashcardCtrl.getPublic = getPublic;
    function remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            // @ts-ignore
            data.userId = req.user.id;
            const rs = yield set_flashcard_1.default.remove(data);
            res.status(200).json(rs);
        });
    }
    SetFlashcardCtrl.remove = remove;
    function update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const rs = yield set_flashcard_1.default.update(data);
            res.status(200).json(rs);
        });
    }
    SetFlashcardCtrl.update = update;
})(SetFlashcardCtrl || (SetFlashcardCtrl = {}));
exports.default = SetFlashcardCtrl;
