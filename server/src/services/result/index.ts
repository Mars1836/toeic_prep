import { BadRequestError } from "../../errors/bad_request_error";
import { NotFoundError } from "../../errors/not_found_error";
import { FlashcardAttr, FlashcardModel } from "../../models/flashcard.model";
import { ResultAttr, resultModel } from "../../models/result.model";
import { ResultItemAttr } from "../../models/result_item.model";
import { testModel } from "../../models/test.model";
import ResultItemRepo from "../result_item/repos";
import SetFlashcardUtil from "../set_flashcard/repos";
import TestSrv from "../test";
import TestRepo from "../test/repos";
import UserRepo from "../user/repos";

namespace ResultSrv {
  export async function create(data: ResultAttr) {
    const isExist = await TestRepo.checkExist(data.testId);
    if (!isExist) {
      throw new BadRequestError("Bài test không tồn tại.");
    }
    const newResult = await resultModel.create(data);
    return newResult;
  }
  export async function creataWithItems(data: {
    rs: ResultAttr;
    rsis: ResultItemAttr[];
  }) {
    const test = await testModel.findById(data.rs.testId).lean();
    if (!test) {
      throw new BadRequestError("Bài test không tồn tại.");
    }
    data.rs.testType = test.type;
    data.rs.numberOfUserAnswers = data.rsis.length;
    data.rs.numberOfCorrectAnswers = data.rsis.filter((item) => {
      return item.useranswer === item.correctanswer;
    }).length;
    const newResult = await resultModel.create(data.rs); // result
    let rsItems;
    if (newResult) {
      rsItems = data.rsis.map((item) => {
        return {
          ...item,
          resultId: newResult.id,
          testId: data.rs.testId,
          testType: data.rs.testType,
          userId: data.rs.userId,
        };
      }) as ResultItemAttr[];
    }

    const newResults = await ResultItemRepo.createMany(rsItems!);
    return newResults;
  }
  export async function getByUser(data: { userId: string }) {
    const isExist = await UserRepo.checkExist(data.userId);
    if (!isExist) {
      throw new BadRequestError("Người dùng không tồn tại");
    }
    const result = await resultModel.find({
      userId: data.userId,
    });
    return result;
  }
  export async function getByTest(data: { userId: string; testId: string }) {
    if (!data.testId) {
      throw new NotFoundError("TestId phải được cung cấp");
    }
    if (!data.userId) {
      throw new NotFoundError("UserId phải được cung cấp");
    }
    const rs = await resultModel.find({
      userId: data.userId,
      testId: data.testId,
    });
    return rs;
  }
}
export default ResultSrv;
