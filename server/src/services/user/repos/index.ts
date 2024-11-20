import { userModel } from "../../../models/user.model";

namespace UserRepo {
  export async function checkExist(id: string) {
    const is = await userModel.findById(id);
    return !!is;
  }
  export async function upgrade(id: string) {
    // Kiểm tra xem người dùng có tồn tại không
    const user = await userModel.findById(id);

    if (!user) {
      throw new Error("Người dùng không tồn tại"); // Nếu không tồn tại, throw lỗi
    }

    // Sử dụng findOneAndUpdate để cập nhật upgradeExpiredDate
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: id }, // Tìm người dùng theo ID
      {
        $set: {
          upgradeExpiredDate: user.upgradeExpiredDate
            ? new Date(
                user.upgradeExpiredDate.getTime() + 30 * 24 * 60 * 60 * 1000
              ) // Cộng thêm 30 ngày
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Nếu upgradeExpiredDate là null, gán ngày hiện tại + 30 ngày
        },
      },
      { new: true } // Trả về bản ghi đã được cập nhật
    );

    return updatedUser;
  }
}
export default UserRepo;
