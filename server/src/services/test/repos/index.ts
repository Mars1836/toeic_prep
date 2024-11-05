import { setFlashcardModel } from "../../../models/set_flashcard.model";
import { testModel } from "../../../models/test.model";

namespace TestRepo {
  export async function checkExist(id: string) {
    const is = await testModel.findById(id);
    return !!is;
  }
}
export default TestRepo;
