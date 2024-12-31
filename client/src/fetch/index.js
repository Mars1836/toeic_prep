import instance from "~configs/axios.instance";
import { handleErrorWithToast } from "~helper";

export async function getLearningFlashcardData(endpoint, learningSetId) {
  try {
    const res = await instance.get(endpoint.learningFlashcard.getBySet, {
      params: {
        learningSetId: learningSetId,
      },
    });
    return res.data;
  } catch (error) {
    handleErrorWithToast(error);
  }
}
export async function getLearningSetData(endpoint, id) {
  try {
    const res = await instance.get(endpoint.learningSet.getById, {
      params: {
        id: id,
      },
    });
    return res.data;
  } catch (error) {
    handleErrorWithToast(error);
  }
}
