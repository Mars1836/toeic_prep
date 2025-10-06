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
const exam_result_1 = __importDefault(require("../../services/exam_result"));
var ExamResultCtrl;
(function (ExamResultCtrl) {
    function create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            //@ts-ignore
            data.userId = req.user.id;
            const rs = yield exam_result_1.default.create(data);
            res.status(200).json(rs);
        });
    }
    ExamResultCtrl.create = create;
    function creataWithItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rs, rsis } = req.body;
            //@ts-ignore
            rs.userId = req.user.id;
            const data = { rs, rsis };
            const _rs = yield exam_result_1.default.creataWithItems(data);
            res.status(200).json(_rs);
        });
    }
    ExamResultCtrl.creataWithItems = creataWithItems;
})(ExamResultCtrl || (ExamResultCtrl = {}));
exports.default = ExamResultCtrl;
