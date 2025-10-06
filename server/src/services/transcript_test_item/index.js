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
exports.createTranscriptTestItem = createTranscriptTestItem;
exports.getTranscriptTestItemByTranscriptTestId = getTranscriptTestItemByTranscriptTestId;
const transcript_test_item_model_1 = require("../../models/transcript_test_item.model");
function createTranscriptTestItem(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const rs = yield transcript_test_item_model_1.transcriptTestItemModel.create(data);
        return rs;
    });
}
function getTranscriptTestItemByTranscriptTestId(transcriptTestId) {
    return __awaiter(this, void 0, void 0, function* () {
        const rs = yield transcript_test_item_model_1.transcriptTestItemModel.find({
            transcriptTestId,
        });
        return rs;
    });
}
