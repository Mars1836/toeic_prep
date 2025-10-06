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
const result_item_1 = __importDefault(require("../../services/result_item"));
var ResultItemCtrl;
(function (ResultItemCtrl) {
    function getByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            const userId = req.user.id;
            const rs = yield result_item_1.default.getByUser(userId);
            res.status(200).json(rs);
        });
    }
    ResultItemCtrl.getByUser = getByUser;
    function getByResult(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { resultId } = req.query;
            //@ts-ignore
            const userId = req.user.id;
            const data = {
                userId,
                resultId: resultId,
            };
            const rs = yield result_item_1.default.getByResult(data);
            res.status(200).json(rs);
        });
    }
    ResultItemCtrl.getByResult = getByResult;
    function getByPart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { part } = req.query;
            //@ts-ignore
            const userId = req.user.id;
            const data = {
                userId,
                part: Number(part),
            };
            const rs = yield result_item_1.default.getByPart(data);
            res.status(200).json(rs);
        });
    }
    ResultItemCtrl.getByPart = getByPart;
})(ResultItemCtrl || (ResultItemCtrl = {}));
exports.default = ResultItemCtrl;
