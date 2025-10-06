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
const result_item_model_1 = require("../../../models/result_item.model");
var ResultItemRepo;
(function (ResultItemRepo) {
    function checkExist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const is = yield result_item_model_1.resultItemModel.findById(id);
            return !!is;
        });
    }
    ResultItemRepo.checkExist = checkExist;
    function createMany(resultItems) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield result_item_model_1.resultItemModel.insertMany(resultItems);
            return rs;
        });
    }
    ResultItemRepo.createMany = createMany;
    function deleteMany(resultId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield result_item_model_1.resultItemModel.deleteMany({ resultId });
            return rs;
        });
    }
    ResultItemRepo.deleteMany = deleteMany;
})(ResultItemRepo || (ResultItemRepo = {}));
exports.default = ResultItemRepo;
