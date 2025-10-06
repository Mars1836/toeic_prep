"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScoreByAccuracy = getScoreByAccuracy;
const toeic_1 = require("../../const/toeic");
function getScoreByAccuracy(accuracyByPart) {
    let score = 0;
    let readCount = 0;
    let listenCount = 0;
    for (const part of [1, 2, 3, 4]) {
        const numberAccuracyByPart = accuracyByPart[part]
            ? Number(accuracyByPart[part])
            : 0;
        const numOfRightQuestion = Math.round((toeic_1.ToeicQuestionCount[part] * numberAccuracyByPart) / 100);
        readCount += numOfRightQuestion;
    }
    for (const part of [5, 6, 7]) {
        const numberAccuracyByPart = accuracyByPart[part]
            ? Number(accuracyByPart[part])
            : 0;
        const numOfRightQuestion = Math.round((toeic_1.ToeicQuestionCount[part] * numberAccuracyByPart) / 100);
        console.log("topic: ", toeic_1.ToeicQuestionCount[part]);
        console.log("topic2: ", accuracyByPart[part], Number(accuracyByPart[part]));
        listenCount += numOfRightQuestion;
        console.log(numOfRightQuestion);
    }
    console.log(listenCount);
    const _listenScore = toeic_1.listenScore[listenCount];
    const _readScore = toeic_1.readScore[readCount];
    score = _listenScore + _readScore;
    return { listenScore: _listenScore, readScore: _readScore, score };
}
