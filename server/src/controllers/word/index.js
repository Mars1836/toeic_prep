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
const word_1 = require("../../services/word");
var WordCtl;
(function (WordCtl) {
    function get4RandomWords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield word_1.WordSrv.get4RandomWords();
            res.status(200).json(rs);
        });
    }
    WordCtl.get4RandomWords = get4RandomWords;
    function createMany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const rs = yield word_1.WordSrv.createMany(data);
            res.status(200).json(rs);
        });
    }
    WordCtl.createMany = createMany;
})(WordCtl || (WordCtl = {}));
exports.default = WordCtl;
