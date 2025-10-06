"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCategoryAccuracy = calculateCategoryAccuracy;
const questionCategory_1 = require("../../configs/questionCategory");
function calculateCategoryAccuracy(questions) {
    // Filter out questions without categories or empty categories
    const validQuestions = questions.filter((q) => q.questionCategory && q.questionCategory.length > 0);
    // Initialize statistics for each category
    const categoryStats = {};
    // Loop through each question and count correct/total
    validQuestions.forEach((question) => {
        question.questionCategory.forEach((category) => {
            if (!questionCategory_1.ToeicQuestionCategories[category])
                return;
            if (!categoryStats[category]) {
                categoryStats[category] = { correct: 0, total: 0 };
            }
            // Increment total questions for the category
            categoryStats[category].total++;
            // Increment correct count if useranswer matches correctanswer
            if (question.useranswer === question.correctanswer) {
                categoryStats[category].correct++;
            }
        });
    });
    // Calculate accuracy for each category
    const categoryAccuracy = {};
    Object.keys(categoryStats).forEach((category) => {
        categoryAccuracy[category] = {
            part: 0,
            title: "",
            accuracy: "",
        };
        const { correct, total } = categoryStats[category];
        if (!questionCategory_1.ToeicQuestionCategories[category])
            return;
        // @ts-ignore
        categoryAccuracy[category].part = questionCategory_1.ToeicQuestionCategories[category].part;
        // @ts-ignore
        categoryAccuracy[category].title =
            //@ts-ignore
            questionCategory_1.ToeicQuestionCategories[category].vietnameseTitle;
        categoryAccuracy[category].accuracy = ((correct / total) * 100).toFixed(2);
    });
    return categoryAccuracy;
}
