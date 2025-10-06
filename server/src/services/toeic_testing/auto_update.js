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
const toeic_testing_model_1 = require("../../models/toeic_testing.model");
const toeic_testing_model_2 = require("../../models/toeic_testing.model");
const AutoUpdateService = {
    updateTestStatuses() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTime = new Date();
            // Find all tests that:
            // 1. Have ended (timeEnd < currentTime)
            // 2. Are still in PENDING status
            const testsToUpdate = yield toeic_testing_model_1.toeicTestingModel.find({
                timeEnd: { $lt: currentTime },
                status: toeic_testing_model_2.TestStatus.PENDING,
            });
            if (testsToUpdate.length > 0) {
                // Update all found tests to CANCELLED status
                yield toeic_testing_model_1.toeicTestingModel.updateMany({
                    _id: { $in: testsToUpdate.map((test) => test._id) },
                }, {
                    $set: { status: toeic_testing_model_2.TestStatus.CANCELLED },
                });
                console.log(`Updated ${testsToUpdate.length} tests to CANCELLED status`);
            }
            // Find all tests that:
            // 1. Have started (timeStart <= currentTime)
            // 2. Haven't ended yet (timeEnd > currentTime)
            // 3. Are in PENDING status
            const testsToStart = yield toeic_testing_model_1.toeicTestingModel.find({
                timeStart: { $lte: currentTime },
                timeEnd: { $gt: currentTime },
                status: toeic_testing_model_2.TestStatus.PENDING,
            });
            if (testsToStart.length > 0) {
                // Update all found tests to IN_PROGRESS status
                yield toeic_testing_model_1.toeicTestingModel.updateMany({
                    _id: { $in: testsToStart.map((test) => test._id) },
                }, {
                    $set: { status: toeic_testing_model_2.TestStatus.IN_PROGRESS },
                });
                console.log(`Updated ${testsToStart.length} tests to IN_PROGRESS status`);
            }
            // Find all tests that:
            // 1. Have ended (timeEnd <= currentTime)
            // 2. Are in IN_PROGRESS status
            const testsToComplete = yield toeic_testing_model_1.toeicTestingModel.find({
                timeEnd: { $lte: currentTime },
                status: toeic_testing_model_2.TestStatus.IN_PROGRESS,
            });
            if (testsToComplete.length > 0) {
                // Update all found tests to COMPLETED status
                yield toeic_testing_model_1.toeicTestingModel.updateMany({
                    _id: { $in: testsToComplete.map((test) => test._id) },
                }, {
                    $set: { status: toeic_testing_model_2.TestStatus.COMPLETED },
                });
                console.log(`Updated ${testsToComplete.length} tests to COMPLETED status`);
            }
        });
    },
};
exports.default = AutoUpdateService;
