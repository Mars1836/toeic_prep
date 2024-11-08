import { Role } from "../../configs/enum";
import { NotFoundError } from "../../errors/not_found_error";
import { flashcardModel } from "../../models/flashcard.model";
import {
  SetFlashcardAttr,
  setFlashcardModel,
} from "../../models/set_flashcard.model";
import { userModel } from "../../models/user.model";

namespace SetFlashcardSrv {
  export async function create(data: SetFlashcardAttr) {
    const user = await userModel.findById(data.userId);
    data.userRole = user?.role || Role.user;
    if (data.userRole === Role.user) {
      data.isPublic = false;
    }
    const newSet = await setFlashcardModel.create(data);
    return newSet;
  }
  export async function getByUser(userId: string) {
    const rs = await setFlashcardModel.find({
      userId: userId,
    });
    return rs;
  }
  export async function getPublic() {
    const rs = await setFlashcardModel.find({
      isPublic: true,
    });
    return rs;
  }
  export async function getById(data: { id: string; userId?: string }) {
    let rs;
    if (!data.userId) {
      rs = await setFlashcardModel
        .findOne({
          _id: data.id,
          isPublic: true,
        })
        .lean();
    }
    rs = await setFlashcardModel
      .findOne({
        userId: data.userId,
        _id: data.id,
      })
      .lean();
    if (!rs) {
      throw new NotFoundError("Không thể truy cập bộ flashcard này");
    }
    const fls = await flashcardModel
      .find({
        setFlashcardId: rs?._id,
      })
      .lean();
    const t = { ...rs, flashcards: fls };
    return t;
  }
}
export default SetFlashcardSrv;
