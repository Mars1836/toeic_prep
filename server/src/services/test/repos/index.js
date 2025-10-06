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
const test_model_1 = require("../../../models/test.model");
var TestRepo;
(function (TestRepo) {
    function checkExist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const is = yield test_model_1.testModel.findById(id);
            return !!is;
        });
    }
    TestRepo.checkExist = checkExist;
    function addAttempt(testId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield test_model_1.testModel.findOneAndUpdate({ _id: testId, "attempts.userId": userId }, { $inc: { "attempts.$.times": 1 } }, // Tăng times lên 1 nếu userId đã tồn tại
            { new: true });
            // Nếu `userId` chưa tồn tại, thêm `TestAttempt` mới với `times` là 1
            if (!result) {
                yield test_model_1.testModel.findOneAndUpdate({ _id: testId }, { $push: { attempts: { userId, times: 1 } } }, { new: true, upsert: true });
            }
            return 1;
        });
    }
    TestRepo.addAttempt = addAttempt;
})(TestRepo || (TestRepo = {}));
exports.default = TestRepo;
