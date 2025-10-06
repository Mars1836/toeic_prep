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
const bad_request_error_1 = require("../../errors/bad_request_error");
const not_found_error_1 = require("../../errors/not_found_error");
const flashcard_model_1 = require("../../models/flashcard.model");
const learning_flashcard_1 = require("../../models/learning_flashcard");
const learning_set_model_1 = require("../../models/learning_set.model");
const set_flashcard_model_1 = require("../../models/set_flashcard.model");
const utils_1 = require("../../utils");
var LearningSetSrv;
(function (LearningSetSrv) {
    // Add a set to the user's learning list
    function addSetToLearn(data) {
        return __awaiter(this, void 0, void 0, function* () {
            //check if set flashcard exist
            const isSetExist = yield set_flashcard_model_1.setFlashcardModel.findOne({
                _id: data.setFlashcardId,
                userId: data.userId,
            });
            if (!isSetExist) {
                throw new bad_request_error_1.BadRequestError("Set flashcard not exist.");
            }
            // Check if the set is already in the user's learning list
            const existingSet = yield learning_set_model_1.learningSetModel.findOne({
                userId: data.userId,
                setFlashcardId: data.setFlashcardId,
            });
            if (existingSet) {
                return existingSet;
            }
            // Create a new learning set document
            const newLearningSet = yield learning_set_model_1.learningSetModel.create(data);
            const flashcards = yield flashcard_model_1.flashcardModel.find({
                setFlashcardId: data.setFlashcardId,
            });
            const learnignFlashcardData = flashcards.map((item) => {
                return {
                    flashcardId: item.id,
                    learningSetId: newLearningSet.id,
                };
            });
            const learningFlashcards = yield learning_flashcard_1.learningFlashcardModel.insertMany(learnignFlashcardData);
            return newLearningSet;
        });
    }
    LearningSetSrv.addSetToLearn = addSetToLearn;
    // Remove a set from the user's learning list
    function removeSetFromLearn(userId, learningSetId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield learning_flashcard_1.learningFlashcardModel.deleteMany({
                learningSetId: learningSetId,
            });
            // Now delete the learning set
            const deletedLearningSet = yield learning_set_model_1.learningSetModel.findOneAndDelete({
                _id: learningSetId,
                userId: userId,
            });
            if (!deletedLearningSet) {
                throw new Error("Learning set not found.");
            }
            return deletedLearningSet;
        });
    }
    LearningSetSrv.removeSetFromLearn = removeSetFromLearn;
    function getLearningSetByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield learning_set_model_1.learningSetModel
                .find({
                userId,
            })
                .populate("setFlashcardId")
                .populate("learningFlashcards")
                .lean();
            if (!result) {
                throw new Error("Set not found in the learning list.");
            }
            let result1 = result.map((item) => {
                return Object.assign(Object.assign({}, item), { id: item._id, learningFlashcards: item.learningFlashcards.map((flashcard) => {
                        return (0, utils_1.getRateDiffDays)(flashcard);
                    }) });
            });
            return result1;
        });
    }
    LearningSetSrv.getLearningSetByUser = getLearningSetByUser;
    function getLearningSetBySetId(setFlashcardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield learning_set_model_1.learningSetModel
                .findOne({
                setFlashcardId,
            })
                .populate("setFlashcardId")
                .populate("learningFlashcards");
            if (!result) {
                throw new not_found_error_1.NotFoundError("Set not found in the learning list.");
            }
            return result;
        });
    }
    LearningSetSrv.getLearningSetBySetId = getLearningSetBySetId;
    function getLearningSetById(learningSetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield learning_set_model_1.learningSetModel
                .findById(learningSetId)
                .populate("setFlashcardId");
            if (!result) {
                throw new not_found_error_1.NotFoundError("Set not found in the learning list.");
            }
            return result;
        });
    }
    LearningSetSrv.getLearningSetById = getLearningSetById;
    // export async function getLearningSetById(data: {
    //   id: string;
    //   userId: string;
    // }) {
    //   const result = await learningSetModel
    //     .find({
    //       _id: data.id,
    //       userId: data.userId,
    //     })
    //     .populate("setFlashcardId");
    //   if (!result) {
    //     throw new Error("Set not found in the learning list.");
    //   }
    //   return result;
    // }
})(LearningSetSrv || (LearningSetSrv = {}));
exports.default = LearningSetSrv;
