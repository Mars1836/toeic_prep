"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAverageTimeByPart = calculateAverageTimeByPart;
function calculateAverageTimeByPart(data) {
    const timeDataByPart = {};
    // Group data by part and sum time
    data.forEach((item) => {
        const part = item.part;
        if (!timeDataByPart[part]) {
            timeDataByPart[part] = { totalQuestions: 0, totalTime: 0 };
        }
        timeDataByPart[part].totalQuestions += 1;
        timeDataByPart[part].totalTime += item.timeSecond;
    });
    // Calculate average time for each part
    const averageTimeByPart = {};
    for (const part in timeDataByPart) {
        const { totalQuestions, totalTime } = timeDataByPart[part];
        averageTimeByPart[part] = (totalTime / totalQuestions).toFixed(2);
    }
    return averageTimeByPart;
}
