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
const transcript_test_1 = require("../../services/transcript_test");
var TranscriptTestCtrl;
(function (TranscriptTestCtrl) {
    function getByQuery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield (0, transcript_test_1.getTranscriptTest)();
            res.status(200).json(rs);
        });
    }
    TranscriptTestCtrl.getByQuery = getByQuery;
    function create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { description, title } = req.body;
            const rs = yield (0, transcript_test_1.createTranscriptTest)({
                description,
                title,
            });
            res.status(200).json(rs);
        });
    }
    TranscriptTestCtrl.create = create;
})(TranscriptTestCtrl || (TranscriptTestCtrl = {}));
exports.default = TranscriptTestCtrl;
