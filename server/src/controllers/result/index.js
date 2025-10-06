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
const result_1 = __importDefault(require("../../services/result"));
var ResultCtrl;
(function (ResultCtrl) {
    function create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("create");
            const data = req.body;
            //@ts-ignore
            data.userId = req.user.id;
            const rs = yield result_1.default.create(data);
            res.status(200).json(rs);
        });
    }
    ResultCtrl.create = create;
    function creataWithItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("create with items");
            const { rs, rsis } = req.body;
            const data = { rs, rsis };
            data.rs.userId = req.user.id;
            const _rs = yield result_1.default.creataWithItems(data);
            res.status(200).json(_rs);
        });
    }
    ResultCtrl.creataWithItems = creataWithItems;
    function getByTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.query;
            //@ts-ignore
            data.userId = req.user.id;
            //@ts-ignore
            const rs = yield result_1.default.getByTest(data);
            res.status(200).json(rs);
        });
    }
    ResultCtrl.getByTest = getByTest;
    function getByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.query;
            //@ts-ignore
            data.userId = req.user.id;
            //@ts-ignore
            const rs = yield result_1.default.getByUser(data);
            res.status(200).json(rs);
        });
    }
    ResultCtrl.getByUser = getByUser;
    function getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            //@ts-ignore
            const data = { userId: req.user.id, id: id };
            const rs = yield result_1.default.getById(data);
            res.status(200).json(rs);
        });
    }
    ResultCtrl.getById = getById;
    function deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            //@ts-ignore
            const data = { userId: req.user.id, id: id };
            const rs = yield result_1.default.deleteById(data);
            res.status(200).json(rs);
        });
    }
    ResultCtrl.deleteById = deleteById;
    function getNewResultAnalyst(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { step, num } = req.query;
            const rs = yield result_1.default.getNewResultAnalyst(Number(step), Number(num));
            res.status(200).json(rs);
        });
    }
    ResultCtrl.getNewResultAnalyst = getNewResultAnalyst;
    function getUserProgressAnalyst(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { step, num } = req.query;
            const rs = yield result_1.default.getUserProgressAnalyst(Number(step), Number(num));
            res.status(200).json(rs);
        });
    }
    ResultCtrl.getUserProgressAnalyst = getUserProgressAnalyst;
})(ResultCtrl || (ResultCtrl = {}));
exports.default = ResultCtrl;
