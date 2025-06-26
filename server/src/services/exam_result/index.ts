import { BadRequestError } from "../../errors/bad_request_error";
import { ExamResultAttr, examResultModel } from "../../models/exam_result";
import { ResultAttr, resultModel } from "../../models/result.model";
import { ResultItemAttr } from "../../models/result_item.model";
import { testModel } from "../../models/test.model";
import ResultItemRepo from "../result_item/repos";
import axios from "axios";
import TestRepo from "../test/repos";
import { calculateToeicScore } from "../../utils";
import { testRegistrationModel } from "../../models/test_registration.model";
import { toeicTestSessionModel } from "../../models/toeic_test_session.model";
import { sendResultExam } from "../../configs/nodemailer";
import { userModel } from "../../models/user.model";
import {
  toeicTestSessionStatusModel,
  ToeicTestSessionStatus,
} from "../../models/toeic_test_session_status";
enum Skill {
  Reading = "reading",
  Listening = "listening",
}
const mapSkill: Record<Skill, number[]> = {
  [Skill.Reading]: [5, 6, 7],
  [Skill.Listening]: [1, 2, 3, 4],
};

namespace ExamResultSrv {
  export async function create(data: ExamResultAttr) {
    const isExist = await TestRepo.checkExist(data.testId);
    if (!isExist) {
      throw new BadRequestError("Bài test không tồn tại.");
    }
    const newResult = await examResultModel.create(data);
    return newResult;
  }
  export async function creataWithItems(data: {
    rs: ExamResultAttr;
    rsis: ResultItemAttr[];
  }) {
    const test = await testModel.findById(data.rs.testId);
    if (!test) {
      throw new BadRequestError("Bài test không tồn tại.");
    }
    data.rs.testId = test.id;
    data.rs.numberOfUserAnswers = data.rsis.length;
    data.rs.numberOfCorrectAnswers = data.rsis.filter((item) => {
      return item.useranswer === item.correctanswer;
    }).length;
    data.rs.numberOfReadingCorrectAnswers = getNumberOfQuestionCorrectBySkill(
      data.rsis,
      Skill.Reading
    );
    data.rs.numberOfListeningCorrectAnswers = getNumberOfQuestionCorrectBySkill(
      data.rsis,
      Skill.Listening
    );
    const { reading, listening, total } = calculateToeicScore(
      data.rs.numberOfReadingCorrectAnswers,
      data.rs.numberOfListeningCorrectAnswers
    );
    const session = await toeicTestSessionModel.findById(data.rs.sessionId);
    if (!session) {
      throw new BadRequestError("Phiên thi không tồn tại.");
    }
    const testRegistration = await testRegistrationModel.findOne({
      examId: session.toeicTestId,
      userId: data.rs.userId,
    });
    if (!testRegistration) {
      throw new BadRequestError("Bạn chưa đăng ký thi.");
    }
    const bodyForCertificate = {
      name: testRegistration.personalInfo.fullName,
      readingScore: reading,
      listeningScore: listening,
      issueDate: new Date().getTime(),
      expirationDate: new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24 * 365
      ).getTime(),
      nationalID: testRegistration.personalInfo.idNumber,
    };
    if (!testRegistration) {
      throw new BadRequestError("Bạn chưa đăng ký thi.");
    }
    await TestRepo.addAttempt(data.rs.testId, data.rs.userId);

    // Tạo status session là FINISHED cho user (đưa lên trước khi gọi tạo chứng chỉ blockchain)
    await toeicTestSessionStatusModel.findOneAndUpdate(
      {
        toeicTestSessionId: data.rs.sessionId,
        userId: data.rs.userId,
      },
      {
        toeicTestSessionId: data.rs.sessionId,
        userId: data.rs.userId,
        status: ToeicTestSessionStatus.FINISHED,
      },
      {
        upsert: true,
        new: true,
      }
    );

    // Gọi tạo chứng chỉ blockchain
    const response = await axios.post(
      `${process.env.BLOCKCHAIN_SERVER_URL}/api/certificates/mint`,
      bodyForCertificate
    );
    if (response.status !== 200) {
      throw new BadRequestError("Lỗi khi tạo chứng chỉ.");
    }
    const user = await userModel.findById(data.rs.userId);
    if (!user) {
      throw new BadRequestError("Người dùng không tồn tại.");
    }
    sendResultExam({
      to: user.email!,
      data: {
        name: testRegistration.personalInfo.fullName,
        certificate: response.data,
      },
    });
    const certificate = response.data;
    const newResult = await examResultModel.create(data.rs); // result
    let rsItems;

    if (newResult) {
      rsItems = data.rsis.map((item) => {
        return {
          ...item,
          examResultId: newResult.id,
          userId: data.rs.userId,
        };
      }) as ResultItemAttr[];
    }
    const newResults = await ResultItemRepo.createMany(rsItems!);

    return newResult;
  }
  function getNumberOfQuestionCorrectBySkill(
    rsis: ResultItemAttr[],
    skill: Skill
  ) {
    const numberOfQuestionCorrectBySkill = rsis.filter((item) => {
      return (
        mapSkill[skill].includes(item.part) &&
        item.useranswer === item.correctanswer
      );
    }).length;
    return numberOfQuestionCorrectBySkill;
  }
}
export default ExamResultSrv;
