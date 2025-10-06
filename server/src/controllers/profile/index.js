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
const profile_1 = __importDefault(require("../../services/profile"));
var ProfileCtrl;
(function (ProfileCtrl) {
    function getAnalyst(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const n = req.query.numOfDays ? Number(req.query.numOfDays) : 7;
            // @ts-ignore
            const userId = req.user.id;
            const rs = yield profile_1.default.getAnalyst(userId);
            res.status(200).json(rs);
        });
    }
    ProfileCtrl.getAnalyst = getAnalyst;
    function getSuggestForStudy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const userId = req.user.id;
            const rs = yield profile_1.default.getSuggestForStudy(userId);
            res.status(200).json(rs);
        });
    }
    ProfileCtrl.getSuggestForStudy = getSuggestForStudy;
})(ProfileCtrl || (ProfileCtrl = {}));
exports.default = ProfileCtrl;
