import { toeicTestingModel } from "../../models/toeic_testing.model";
import { TestStatus } from "../../models/toeic_testing.model";

const AutoUpdateService = {
  async updateTestStatuses() {
    const currentTime = new Date();

    // Find all tests that:
    // 1. Have ended (timeEnd < currentTime)
    // 2. Are still in PENDING status
    const testsToUpdate = await toeicTestingModel.find({
      timeEnd: { $lt: currentTime },
      status: TestStatus.PENDING,
    });

    if (testsToUpdate.length > 0) {
      // Update all found tests to CANCELLED status
      await toeicTestingModel.updateMany(
        {
          _id: { $in: testsToUpdate.map((test) => test._id) },
        },
        {
          $set: { status: TestStatus.CANCELLED },
        }
      );

      console.log(`Updated ${testsToUpdate.length} tests to CANCELLED status`);
    }

    // Find all tests that:
    // 1. Have started (timeStart <= currentTime)
    // 2. Haven't ended yet (timeEnd > currentTime)
    // 3. Are in PENDING status
    const testsToStart = await toeicTestingModel.find({
      timeStart: { $lte: currentTime },
      timeEnd: { $gt: currentTime },
      status: TestStatus.PENDING,
    });

    if (testsToStart.length > 0) {
      // Update all found tests to IN_PROGRESS status
      await toeicTestingModel.updateMany(
        {
          _id: { $in: testsToStart.map((test) => test._id) },
        },
        {
          $set: { status: TestStatus.IN_PROGRESS },
        }
      );

      console.log(`Updated ${testsToStart.length} tests to IN_PROGRESS status`);
    }

    // Find all tests that:
    // 1. Have ended (timeEnd <= currentTime)
    // 2. Are in IN_PROGRESS status
    const testsToComplete = await toeicTestingModel.find({
      timeEnd: { $lte: currentTime },
      status: TestStatus.IN_PROGRESS,
    });

    if (testsToComplete.length > 0) {
      // Update all found tests to COMPLETED status
      await toeicTestingModel.updateMany(
        {
          _id: { $in: testsToComplete.map((test) => test._id) },
        },
        {
          $set: { status: TestStatus.COMPLETED },
        }
      );

      console.log(
        `Updated ${testsToComplete.length} tests to COMPLETED status`
      );
    }
  },
};

export default AutoUpdateService;
