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
const not_found_error_1 = require("../../errors/not_found_error");
const flashcard_model_1 = require("../../models/flashcard.model");
const set_flashcard_model_1 = require("../../models/set_flashcard.model");
const repos_1 = __importDefault(require("../learning_flashcard/repos"));
var FlashCardSrv;
(function (FlashCardSrv) {
    function getBySet(setFlashcardId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSetExist = yield set_flashcard_model_1.setFlashcardModel.findOne({
                _id: setFlashcardId,
                userId: userId,
            });
            if (!isSetExist) {
                throw new bad_request_error_1.BadRequestError("Set flashcard not exist.");
            }
            const rs = yield flashcard_model_1.flashcardModel
                .find({
                setFlashcardId: setFlashcardId,
            })
                .sort({ createdAt: -1 });
            return rs;
        });
    }
    FlashCardSrv.getBySet = getBySet;
    function create(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSetExist = yield set_flashcard_model_1.setFlashcardModel.findOne({
                _id: data.setFlashcardId,
                userId: userId,
            });
            if (!isSetExist) {
                throw new bad_request_error_1.BadRequestError("Set flashcard not exist.");
            }
            const newCard = yield flashcard_model_1.flashcardModel.create(data);
            yield repos_1.default.createMany([{ flashcardId: newCard.id }], userId, data.setFlashcardId);
            yield set_flashcard_model_1.setFlashcardModel.updateOne({ _id: data.setFlashcardId, userId: userId }, { $inc: { numberOfFlashcards: 1 } });
            return newCard;
        });
    }
    FlashCardSrv.create = create;
    function createMany(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data) {
                throw new bad_request_error_1.BadRequestError("Dữ liệu truyền vào trống");
            }
            if (data.length === 0) {
                throw new bad_request_error_1.BadRequestError("Dữ liệu truyền vào trống");
            }
            const setFlashcardId = data[0].setFlashcardId;
            const isSetExist = yield set_flashcard_model_1.setFlashcardModel.findOne({
                _id: setFlashcardId,
                userId: userId,
            });
            const dataUser = data.map((item) => {
                return Object.assign(Object.assign({}, item), { userId: userId });
            });
            if (!isSetExist) {
                throw new bad_request_error_1.BadRequestError("Set flashcard not exist.");
            }
            const newCards = yield flashcard_model_1.flashcardModel.insertMany(dataUser);
            yield set_flashcard_model_1.setFlashcardModel.updateOne({ _id: setFlashcardId, userId: userId }, { $inc: { numberOfFlashcards: dataUser.length } });
            return newCards;
        });
    }
    FlashCardSrv.createMany = createMany;
    function remove(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const fc = yield flashcard_model_1.flashcardModel.findById(data.id);
            if (!fc) {
                throw new not_found_error_1.NotFoundError("Flashcard này không tồn tại");
            }
            const isSetExist = yield set_flashcard_model_1.setFlashcardModel
                .findOne({
                _id: fc === null || fc === void 0 ? void 0 : fc.setFlashcardId,
                userId: data.userId,
            })
                .lean();
            if (!isSetExist) {
                throw new bad_request_error_1.BadRequestError("Set flashcard not exist.");
            }
            // Xóa flashcard
            yield flashcard_model_1.flashcardModel.deleteOne({
                _id: data.id,
            });
            // Giảm numberOfFlashcards trong set flashcard
            yield set_flashcard_model_1.setFlashcardModel.updateOne({ _id: fc.setFlashcardId, userId: data.userId }, { $inc: { numberOfFlashcards: -1 } });
            return { message: "Flashcard removed successfully." };
        });
    }
    FlashCardSrv.remove = remove;
    function update(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const fc = yield flashcard_model_1.flashcardModel.findById(query.id);
            if (!fc) {
                throw new not_found_error_1.NotFoundError("Flashcard này không tồn tại");
            }
            const isSetExist = yield set_flashcard_model_1.setFlashcardModel.findOne({
                _id: fc.setFlashcardId,
                userId: query.userId,
            });
            if (!isSetExist) {
                throw new bad_request_error_1.BadRequestError("Set flashcard not exist.");
            }
            const rs = yield flashcard_model_1.flashcardModel.findOneAndUpdate({ _id: query.id, setFlashcardId: fc.setFlashcardId }, { $set: data }, { new: true } // Trả về tài liệu đã cập nhật
            );
            if (!rs) {
                throw new bad_request_error_1.BadRequestError("Something wrong");
            }
            return rs;
        });
    }
    FlashCardSrv.update = update;
})(FlashCardSrv || (FlashCardSrv = {}));
exports.default = FlashCardSrv;
