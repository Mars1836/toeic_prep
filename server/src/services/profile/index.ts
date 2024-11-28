import { resultItemModel } from "../../models/result_item.model";
import { getTimeLastNDays } from "../../utils";
import { calculateAverageTimeByPart } from "../../utils/analyst/average_time";
import { calculateCategoryAccuracy } from "../../utils/analyst/category_accuracy";
import { calculateAccuracyByPart } from "../../utils/analyst/part_accuracy";
import { getScoreByAccuracy } from "../../utils/analyst/score";
import { timeSecondRecommend } from "../../const/toeic";
namespace ProfileService {
  export const getAnalyst = async (userId: string, n: number) => {
    const { from, to } = getTimeLastNDays(n);
    const rs = await resultItemModel
      .find({
        userId: userId,
        createdAt: { $gte: from, $lte: to },
      })
      .lean();
    const accuracyByPart = calculateAccuracyByPart(rs);
    const averageTimeByPart = calculateAverageTimeByPart(rs);
    const categoryAccuracy = calculateCategoryAccuracy(rs);
    const { listenScore, readScore, score } =
      getScoreByAccuracy(accuracyByPart);
    return {
      accuracyByPart,
      averageTimeByPart,
      categoryAccuracy,
      listenScore,
      readScore,
      score,
      timeSecondRecommend,
    };
  };
}
export default ProfileService;
