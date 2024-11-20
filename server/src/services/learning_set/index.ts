import { BadRequestError } from "../../errors/bad_request_error";
import { NotFoundError } from "../../errors/not_found_error";
import { flashcardModel } from "../../models/flashcard.model";
import { learningFlashcardModel } from "../../models/learning_flashcard";
import {
  learningSetModel,
  LearningSetAttr,
} from "../../models/learning_set.model";
import { setFlashcardModel } from "../../models/set_flashcard.model";

namespace LearningSetSrv {
  // Add a set to the user's learning list
  export async function addSetToLearn(data: LearningSetAttr) {
    //check if set flashcard exist
    const isSetExist = await setFlashcardModel.findOne({
      _id: data.setFlashcardId,
      userId: data.userId,
    });
    if (!isSetExist) {
      throw new BadRequestError("Set flashcard not exist.");
    }
    // Check if the set is already in the user's learning list
    const existingSet = await learningSetModel.findOne({
      userId: data.userId,
      setFlashcardId: data.setFlashcardId,
    });

    if (existingSet) {
      return existingSet;
    }

    // Create a new learning set document
    const newLearningSet = await learningSetModel.create(data);
    const flashcards = await flashcardModel.find({
      setFlashcardId: data.setFlashcardId,
    });
    const learnignFlashcardData = flashcards.map((item) => {
      return {
        flashcardId: item.id,
        learningSetId: newLearningSet.id,
      };
    });
    console.log(learnignFlashcardData);
    const learningFlashcards = await learningFlashcardModel.insertMany(
      learnignFlashcardData
    );
    return newLearningSet;
  }

  // Remove a set from the user's learning list
  export async function removeSetFromLearn(
    userId: string,
    learningSetId: string
  ) {
    await learningFlashcardModel.deleteMany({
      learningSetId: learningSetId,
    });

    // Now delete the learning set
    const deletedLearningSet = await learningSetModel.findOneAndDelete({
      _id: learningSetId,
      userId: userId,
    });

    if (!deletedLearningSet) {
      throw new Error("Learning set not found.");
    }

    return deletedLearningSet;
  }
  export async function getLearningSetByUser(userId: string) {
    const result = await learningSetModel
      .find({
        userId,
      })
      .populate("setFlashcardId");

    if (!result) {
      throw new Error("Set not found in the learning list.");
    }

    return result;
  }
  export async function getLearningSetBySetId(setFlashcardId: string) {
    const result = await learningSetModel
      .findOne({
        setFlashcardId,
      })
      .populate("setFlashcardId"); //TODO: add populate
    if (!result) {
      throw new NotFoundError("Set not found in the learning list.");
    }
    return result;
  }
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
}

export default LearningSetSrv;
