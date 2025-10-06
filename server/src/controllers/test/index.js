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
const test_1 = __importDefault(require("../../services/test"));
var TestCtrl;
(function (TestCtrl) {
    function create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const rs = yield test_1.default.create(data);
            res.status(200).json(rs);
        });
    }
    TestCtrl.create = create;
    function getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield test_1.default.getAll();
            res.status(200).json(rs);
        });
    }
    TestCtrl.getAll = getAll;
    function getByQuery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = req.query;
            //@ts-ignore
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            console.log("user: ", req.user);
            const rs = yield test_1.default.getByQuery(query, userId);
            res.status(200).json(rs);
        });
    }
    TestCtrl.getByQuery = getByQuery;
    function getByCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.query;
            const rs = yield test_1.default.getByCode(code);
            res.status(200).json(rs);
        });
    }
    TestCtrl.getByCode = getByCode;
    function getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            const rs = yield test_1.default.getById(id);
            res.status(200).json(rs);
        });
    }
    TestCtrl.getById = getById;
    function updateAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const rs = yield test_1.default.updateAll(body);
            res.status(200).json(rs);
        });
    }
    TestCtrl.updateAll = updateAll;
    function handleExcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            const rs = yield test_1.default.handleExcel(id);
            res.status(200).json(rs);
        });
    }
    TestCtrl.handleExcel = handleExcel;
})(TestCtrl || (TestCtrl = {}));
exports.default = TestCtrl;
