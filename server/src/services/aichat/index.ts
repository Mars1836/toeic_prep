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
      return new BadRequestError("prompt is required");
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
}

export default AiChatSrv;
