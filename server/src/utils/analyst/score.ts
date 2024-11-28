import { ToeicQuestionCount, readScore, listenScore } from "../../const/toeic";
export function getScoreByAccuracy(accuracyByPart: Record<string, string>) {
  let score = 0;
  let readCount = 0;
  let listenCount = 0;
  for (const part of [1, 2, 3, 4] as const) {
    const numOfRightQuestion = Math.round(
      ToeicQuestionCount[part] * (Number(accuracyByPart[part]) / 100)
    );
    readCount += numOfRightQuestion;
  }
  for (const part of [5, 6, 7] as const) {
    const numOfRightQuestion = Math.round(
      ToeicQuestionCount[part] * (Number(accuracyByPart[part]) / 100)
    );
    listenCount += numOfRightQuestion;
  }
  const _listenScore = listenScore[listenCount as keyof typeof listenScore];
  const _readScore = readScore[readCount as keyof typeof readScore];
  score = _listenScore + _readScore;
  return { listenScore: _listenScore, readScore: _readScore, score };
}
