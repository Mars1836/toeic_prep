import { explainAIModel } from "../../configs/aichat/explainQues";
import { modelAI } from "../../configs/aichat/fillField";
import { modelAIQuizz } from "../../configs/aichat/renderQuizz";
import { BadRequestError } from "../../errors/bad_request_error";
import { FlashcardAttr } from "../../models/flashcard.model";

function promptText(word: string) {
  return `Provide structured details for the word "${word}" following the specified schema.`;
}
namespace AiChatSrv {
  export async function getFlashcardInfor(prompt: string) {
    if (!prompt) {
      throw new BadRequestError("prompt is required");
    }
    const promptHandled = promptText(prompt);
    const result = await modelAI.generateContent(promptHandled);
    // const json = JSON.parse(result.response.text());
    return result.response.text();
  }
  export async function getQuizz(flashcards: FlashcardAttr[]) {
    const prompt = `Generate quiz questions based on this input: ${JSON.stringify(
      flashcards
    )}`;
    const result = await modelAIQuizz.generateContent(prompt);
    return result.response.text();
  }
  export async function explainQuestion(question: Object) {
    const prompt = `Tạo lời giải bằng tiếng việt với câu hỏi: ${JSON.stringify(
      question
    )}`;
    const result = await explainAIModel.generateContent(prompt);
    return result.response.text();
  }
  export async function explainQuestionJson(question: Object) {
    const text = await explainQuestion(question);
    return JSON.parse(text);
  }
  export async function getQuizzJson(flashcards: FlashcardAttr[]) {
    const text = await getQuizz(flashcards);
    return JSON.parse(text);
  }
  export async function getFlashcardInforJson(prompt: string) {
    const text = await getFlashcardInfor(prompt);
    return JSON.parse(text);
  }
}

export default AiChatSrv;
