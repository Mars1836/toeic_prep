"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../../models/user.model");
function isExpired(date) {
    if (!date)
        return true;
    return date < new Date();
}
var UserRepo;
(function (UserRepo) {
    function checkExist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const is = yield user_model_1.userModel.findById(id);
            return !!is;
        });
    }
    UserRepo.checkExist = checkExist;
    function upgrade(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Kiểm tra xem người dùng có tồn tại không
            const user = yield user_model_1.userModel.findById(id);
            if (!user) {
                throw new Error("Người dùng không tồn tại"); // Nếu không tồn tại, throw lỗi
            }
            if (isExpired(user.upgradeExpiredDate)) {
                // Sử dụng findOneAndUpdate để cập nhật upgradeExpiredDate
                const updatedUser = yield user_model_1.userModel.findOneAndUpdate({ _id: id }, // Tìm người dùng theo ID
                {
                    $set: {
                        upgradeExpiredDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
                    },
                }, { new: true } // Trả về bản ghi đã được cập nhật
                );
                return updatedUser;
            }
            else {
                const updatedUser = yield user_model_1.userModel.findOneAndUpdate({ _id: id }, // Tìm người dùng theo ID
                {
                    $set: {
                        upgradeExpiredDate: new Date(user.upgradeExpiredDate.getTime() + 30 * 24 * 60 * 60 * 1000), // Cộng thêm 30 ngày
                    },
                }, { new: true } // Trả về bản ghi đã được cập nhật
                );
                return updatedUser;
            }
        });
    }
    UserRepo.upgrade = upgrade;
})(UserRepo || (UserRepo = {}));
exports.default = UserRepo;
