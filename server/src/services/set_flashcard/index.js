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
const enum_1 = require("../../configs/enum");
const not_found_error_1 = require("../../errors/not_found_error");
const flashcard_model_1 = require("../../models/flashcard.model");
const set_flashcard_model_1 = require("../../models/set_flashcard.model");
const user_model_1 = require("../../models/user.model");
var SetFlashcardSrv;
(function (SetFlashcardSrv) {
    function create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.userModel.findById(data.userId);
            data.userRole = (user === null || user === void 0 ? void 0 : user.role) || enum_1.Role.user;
            if (data.userRole === enum_1.Role.user) {
                data.isPublic = false;
            }
            const newSet = yield set_flashcard_model_1.setFlashcardModel.create(data);
            return newSet;
        });
    }
    SetFlashcardSrv.create = create;
    function getByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield set_flashcard_model_1.setFlashcardModel.find({
                userId: userId,
            });
            return rs;
        });
    }
    SetFlashcardSrv.getByUser = getByUser;
    function getPublic() {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield set_flashcard_model_1.setFlashcardModel.find({
                isPublic: true,
            });
            return rs;
        });
    }
    SetFlashcardSrv.getPublic = getPublic;
    function getById(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let rs;
            if (!data.userId) {
                rs = yield set_flashcard_model_1.setFlashcardModel.findOne({
                    _id: data.id,
                    isPublic: true,
                });
            }
            rs = yield set_flashcard_model_1.setFlashcardModel.findOne({
                userId: data.userId,
                _id: data.id,
            });
            if (!rs) {
                throw new not_found_error_1.NotFoundError("Không thể truy cập bộ flashcard này");
            }
            return rs;
        });
    }
    SetFlashcardSrv.getById = getById;
    function remove(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield set_flashcard_model_1.setFlashcardModel.findByIdAndDelete({
                _id: data.id,
                userId: data.userId,
            });
            if (rs) {
                const fls = yield flashcard_model_1.flashcardModel.deleteMany({
                    setFlashcardId: rs._id,
                });
            }
            return rs;
        });
    }
    SetFlashcardSrv.remove = remove;
    function update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield set_flashcard_model_1.setFlashcardModel.findByIdAndUpdate({ _id: data.id, userId: data.userId }, data, {
                new: true,
            });
            return rs;
        });
    }
    SetFlashcardSrv.update = update;
})(SetFlashcardSrv || (SetFlashcardSrv = {}));
exports.default = SetFlashcardSrv;
