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
const not_found_error_1 = require("../../errors/not_found_error");
const user_set_flashcard_model_1 = require("../../models/user_set_flashcard.model");
const repos_1 = __importDefault(require("../set_flashcard/repos"));
const repos_2 = __importDefault(require("../user/repos"));
var UserSetFlashcardSrv;
(function (UserSetFlashcardSrv) {
    function create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSetFCExist = yield repos_1.default.checkExist(data.setFlashcardId);
            const isUserExist = yield repos_2.default.checkExist(data.userId);
            if (isUserExist) {
                throw new not_found_error_1.NotFoundError("Người dùng không tồn tại");
            }
            if (!isSetFCExist) {
                throw new not_found_error_1.NotFoundError("Bộ flashcard không tồn tại");
            }
            const newSet = yield user_set_flashcard_model_1.userSetFlashcardModel.create(data);
            return newSet;
        });
    }
    UserSetFlashcardSrv.create = create;
    function getByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield user_set_flashcard_model_1.userSetFlashcardModel.find({
                userId: userId,
            });
            return rs;
        });
    }
    UserSetFlashcardSrv.getByUser = getByUser;
})(UserSetFlashcardSrv || (UserSetFlashcardSrv = {}));
exports.default = UserSetFlashcardSrv;
