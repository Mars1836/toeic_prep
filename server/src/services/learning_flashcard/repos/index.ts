import { learningFlashcardModel } from "../../../models/learning_flashcard";
import { AlgorithmsScoreFlashcard } from "../../../utils/algorithms_score_flashcard";
const DISTANCE_FACTOR = 2;

namespace LearningFlashcardRepo {
  export async function updateScore(data: {
    id: string;
    difficult_rate: number;
    accuracy: number;
    timeMinutes: number;
  }) {
    const { id, difficult_rate, accuracy, timeMinutes } = data;
    const now = new Date();
    const Q = accuracy * 5;
    const learningFlashcard = await learningFlashcardModel.findById(id);
    let t_actual = 0;
    if (!learningFlashcard) {
      throw new Error("Learning flashcard not found");
    }
    let last_studied;
    if (!learningFlashcard!.lastStudied) {
      last_studied = null;
    } else {
      last_studied = new Date(learningFlashcard!.lastStudied);
    }
    let algorithmsScoreFlashcard;
    if (!last_studied) {
      algorithmsScoreFlashcard = new AlgorithmsScoreFlashcard(
        1,
        0,
        learningFlashcard.EF,
        Q,
        timeMinutes,
        accuracy,
        learningFlashcard.retentionScore || 1,
        learningFlashcard.interval || 0,
        difficult_rate
      );
    } else {
      t_actual =
        (now.getTime() - last_studied.getTime()) / (1000 * 60 * 60 * 24);
      algorithmsScoreFlashcard = new AlgorithmsScoreFlashcard(
        learningFlashcard!.studyTime + 1,
        t_actual,
        learningFlashcard?.EF,
        Q,
        timeMinutes,
        accuracy,
        learningFlashcard.retentionScore || 1,
        learningFlashcard.interval || 0,
        difficult_rate
      );
    }
    let isCountNextOptimalTime = false;
    if (t_actual && t_actual / algorithmsScoreFlashcard.interval > 0.8) {
      isCountNextOptimalTime = true;
    }
    const optimalDateNext = new Date(
      now.getTime() +
        algorithmsScoreFlashcard.calculateOptimalTime() * 1000 * 60 * 60 * 24
    );

    const newLearningFlashcard = await learningFlashcardModel.findByIdAndUpdate(
      id,
      {
        studyTime: learningFlashcard!.studyTime + 1,
        lastStudied: now,
        EF: algorithmsScoreFlashcard.calculateEF(),
        retentionScore: algorithmsScoreFlashcard.calculateMemoryRetention(),
        decayScore: algorithmsScoreFlashcard.calculateDecay(),
        optimalTime: isCountNextOptimalTime
          ? optimalDateNext
          : learningFlashcard!.optimalTime,
        interval: isCountNextOptimalTime
          ? algorithmsScoreFlashcard.calculateOptimalTime()
          : learningFlashcard!.interval,
      }
    );
    return newLearningFlashcard;
  }
}
export default LearningFlashcardRepo;
