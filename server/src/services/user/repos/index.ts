import { userModel } from "../../../models/user.model";

namespace UserRepo {
  export async function checkExist(id: string) {
    const is = await userModel.findById(id);
    return !!is;
  }
}
export default UserRepo;
