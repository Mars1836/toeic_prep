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
const transcript_test_item_1 = require("../../services/transcript_test_item");
const transcript_test_item_2 = require("../../services/transcript_test_item");
var TranscriptTestItemCtrl;
(function (TranscriptTestItemCtrl) {
    function getByQuery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { transcriptTestId, audioUrl, transcript } = req.body;
            const rs = yield (0, transcript_test_item_1.createTranscriptTestItem)({
                transcriptTestId,
                audioUrl,
                transcript,
            });
            res.status(200).json(rs);
        });
    }
    TranscriptTestItemCtrl.getByQuery = getByQuery;
    function getByTranscriptTestId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { transcriptTestId } = req.query;
            const rs = yield (0, transcript_test_item_2.getTranscriptTestItemByTranscriptTestId)(transcriptTestId);
            res.status(200).json(rs);
        });
    }
    TranscriptTestItemCtrl.getByTranscriptTestId = getByTranscriptTestId;
})(TranscriptTestItemCtrl || (TranscriptTestItemCtrl = {}));
exports.default = TranscriptTestItemCtrl;
