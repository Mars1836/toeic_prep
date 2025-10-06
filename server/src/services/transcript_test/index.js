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
exports.getTranscriptTest = getTranscriptTest;
exports.createTranscriptTest = createTranscriptTest;
const transcript_test_model_1 = require("../../models/transcript_test.model");
const utils_1 = require("../../utils");
function getTranscriptTest() {
    return __awaiter(this, void 0, void 0, function* () {
        const rs = yield transcript_test_model_1.transcriptTestModel.find({});
        return rs;
    });
}
function createTranscriptTest(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = (0, utils_1.generateOTP)().toString();
        const url = "transcript-test";
        const rs = yield transcript_test_model_1.transcriptTestModel.create(Object.assign(Object.assign({}, data), { code,
            url }));
        return rs;
    });
}
