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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flashcard_1 = __importDefault(require("../../services/flashcard"));
var FlashCardCtrl;
(function (FlashCardCtrl) {
    function create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            //@ts-ignore
            const userId = req.user.id;
            const flashcard = yield flashcard_1.default.create(req.body, userId);
            res.status(200).json(flashcard);
        });
    }
    FlashCardCtrl.create = create;
    function createMany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            //@ts-ignore
            const userId = req.user.id;
            const flashcard = yield flashcard_1.default.createMany(data, userId);
            res.status(200).json(flashcard);
        });
    }
    FlashCardCtrl.createMany = createMany;
    function getBySet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { setFlashcardId } = req.query;
            //@ts-ignore
            const userId = req.user.id;
            const d = setFlashcardId;
            const flashcard = yield flashcard_1.default.getBySet(d, userId);
            res.status(200).json(flashcard);
        });
    }
    FlashCardCtrl.getBySet = getBySet;
    function update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const _b = req.body, { id } = _b, data = __rest(_b, ["id"]);
            const query = {
                id: id,
                //@ts-ignore
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            };
            const flashcard = yield flashcard_1.default.update(query, data);
            res.status(200).json(flashcard);
        });
    }
    FlashCardCtrl.update = update;
    function remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, setFlashcardId } = req.body;
            const data = {
                id,
                setFlashcardId,
                //@ts-ignore
                userId: req.user.id,
            };
            const flashcard = yield flashcard_1.default.remove(data);
            res.status(200).json(flashcard);
        });
    }
    FlashCardCtrl.remove = remove;
})(FlashCardCtrl || (FlashCardCtrl = {}));
exports.default = FlashCardCtrl;
