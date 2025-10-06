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
const bad_request_error_1 = require("../../errors/bad_request_error");
const result_item_model_1 = require("../../models/result_item.model");
const repos_1 = __importDefault(require("../test/repos"));
var ResultItemSrv;
(function (ResultItemSrv) {
    function getByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield result_item_model_1.resultItemModel.find({
                userId,
            });
            return rs;
        });
    }
    ResultItemSrv.getByUser = getByUser;
    function getByResult(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.userId) {
                throw new bad_request_error_1.BadRequestError("userId phải được cung cấp!");
            }
            if (!data.resultId) {
                throw new bad_request_error_1.BadRequestError("resultId phải được cung cấp!");
            }
            const rs = yield result_item_model_1.resultItemModel.find({
                userId: data.userId,
                resultId: data.resultId,
            });
            return rs;
        });
    }
    ResultItemSrv.getByResult = getByResult;
    function getByPart(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.part) {
                throw new bad_request_error_1.BadRequestError("part phải được cung cấp dưới dạng số!");
            }
            const rs = yield result_item_model_1.resultItemModel.find({
                userId: data.userId,
                part: data.part,
            });
            return rs;
        });
    }
    ResultItemSrv.getByPart = getByPart;
    function create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = yield repos_1.default.checkExist(data.testId);
            if (!isExist) {
                throw new bad_request_error_1.BadRequestError("Bài test không tồn tại.");
            }
            const newResultItem = yield result_item_model_1.resultItemModel.create(data);
            return newResultItem;
        });
    }
    ResultItemSrv.create = create;
})(ResultItemSrv || (ResultItemSrv = {}));
exports.default = ResultItemSrv;
