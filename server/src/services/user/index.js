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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSrv = void 0;
exports.getById = getById;
exports.updateTargetScore = updateTargetScore;
exports.getAllUsers = getAllUsers;
exports.getUpgradeUsers = getUpgradeUsers;
exports.getTotalUserAnalyst = getTotalUserAnalyst;
exports.getNewUserAnalyst = getNewUserAnalyst;
exports.getUpgradeUserAnalyst = getUpgradeUserAnalyst;
exports.getUserProgressAnalyst = getUserProgressAnalyst;
exports.hashPassword = hashPassword;
const user_model_1 = require("../../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const const_1 = require("../../configs/const");
const bad_request_error_1 = require("../../errors/bad_request_error");
const transaction_model_1 = require("../../models/transaction.model");
const utils_1 = require("../../utils");
function localCreate(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkEmail = yield user_model_1.userModel.findOne({ email: data.email });
        if (checkEmail) {
            throw new bad_request_error_1.BadRequestError("Email in use");
        }
        data.password = yield bcryptjs_1.default.hash(data.password, parseInt(const_1.constEnv.passwordSalt));
        // Store hash in your password DB.
        const user = yield user_model_1.userModel.create(data);
        return user;
    });
}
function googleCreate(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.userModel.create(data);
        return user;
    });
}
function facebookCreate(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.userModel.create(data);
        return user;
    });
}
function localLogin(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.userModel.findOne({
            email: data.email,
        });
        if (!user) {
            throw new bad_request_error_1.BadRequestError("Email or password is wrong");
        }
        const verify = yield bcryptjs_1.default.compare(data.password, user.password);
        if (!verify) {
            throw new bad_request_error_1.BadRequestError("Email or password is wrong");
        }
        return user;
    });
}
function updateAvatar(id, avatar) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.userModel.findByIdAndUpdate(id, { avatar }, { new: true });
        return user;
    });
}
function updateProfile(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.userModel.findByIdAndUpdate(id, data, { new: true });
        return user;
    });
}
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.userModel.findById(id).select("-password");
        return user;
    });
}
function updateTargetScore(id_1, _a) {
    return __awaiter(this, arguments, void 0, function* (id, { reading, listening }) {
        const targetScore = {
            reading,
            listening,
        };
        const user = yield user_model_1.userModel.findByIdAndUpdate(id, { targetScore }, {
            new: true,
        });
        return user;
    });
}
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield user_model_1.userModel.find({}).select("-password");
        return users;
    });
}
function getUpgradeUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield user_model_1.userModel.find({
            upgradeExpiredDate: { $gt: new Date() },
        });
        return users;
    });
}
function getTotalUserAnalyst() {
    return __awaiter(this, void 0, void 0, function* () {
        const totalUser = yield user_model_1.userModel.countDocuments();
        return totalUser;
    });
}
function getNewUserAnalyst(step, num) {
    return __awaiter(this, void 0, void 0, function* () {
        // Lấy ngày hiện tại
        // Lấy ngày hiện tại
        const currentDate = new Date();
        // Tính ngày bắt đầu
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - step * num);
        const periodStart = (0, utils_1.getStartOfPeriod)(startDate, step);
        const result = yield user_model_1.userModel.aggregate([
            {
                // Lọc các user được tạo từ startDate
                $match: {
                    createdAt: { $gte: periodStart },
                },
            },
            {
                // Thêm trường period để nhóm
                $addFields: {
                    periodStart: {
                        $subtract: [
                            { $toDate: "$createdAt" },
                            {
                                $mod: [
                                    { $subtract: [{ $toDate: "$createdAt" }, periodStart] },
                                    step * 24 * 60 * 60 * 1000,
                                ],
                            },
                        ],
                    },
                },
            },
            {
                // Nhóm theo period
                $group: {
                    _id: "$periodStart",
                    count: { $sum: 1 },
                },
            },
            {
                // Sắp xếp theo thời gian
                $sort: {
                    _id: 1,
                },
            },
        ]);
        // Format lại kết quả
        const formattedResult = [];
        let currentPeriod = new Date(periodStart);
        for (let i = 0; i < num; i++) {
            const periodEnd = new Date(currentPeriod);
            periodEnd.setDate(periodEnd.getDate() + step - 1);
            // Tìm data tương ứng trong result
            const periodData = result.find((item) => item._id.getTime() === currentPeriod.getTime());
            formattedResult.push({
                period: `${(0, utils_1.formatDate)(currentPeriod)} - ${(0, utils_1.formatDate)(periodEnd)}`,
                startDate: currentPeriod.toISOString(),
                endDate: periodEnd.toISOString(),
                count: periodData ? periodData.count : 0,
            });
            // Chuyển sang period tiếp theo
            currentPeriod.setDate(currentPeriod.getDate() + step);
        }
        return formattedResult;
    });
}
function getUpgradeUserAnalyst(step, num) {
    return __awaiter(this, void 0, void 0, function* () {
        // Lấy ngày hiện tại
        const currentDate = new Date();
        // Tính ngày bắt đầu
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - step * num);
        const periodStart = (0, utils_1.getStartOfPeriod)(startDate, step);
        const result = yield transaction_model_1.transactionModel.aggregate([
            {
                // Lọc các transaction từ startDate
                $match: {
                    createdAt: { $gte: periodStart },
                },
            },
            {
                // Thêm trường period để nhóm
                $addFields: {
                    periodStart: {
                        $subtract: [
                            { $toDate: "$createdAt" },
                            {
                                $mod: [
                                    { $subtract: [{ $toDate: "$createdAt" }, periodStart] },
                                    step * 24 * 60 * 60 * 1000,
                                ],
                            },
                        ],
                    },
                },
            },
            {
                // Nhóm theo period và đếm số lượng userId unique
                $group: {
                    _id: {
                        period: "$periodStart",
                        userId: "$userId", // Thêm userId vào _id để nhóm
                    },
                },
            },
            {
                // Nhóm lại theo period và đếm số lượng unique users
                $group: {
                    _id: "$_id.period",
                    count: { $sum: 1 }, // Đếm số lượng nhóm unique (userId)
                },
            },
            {
                // Sắp xếp theo thời gian
                $sort: {
                    _id: 1,
                },
            },
        ]);
        // Format lại kết quả
        const formattedResult = [];
        let currentPeriod = new Date(periodStart);
        for (let i = 0; i < num; i++) {
            const periodEnd = new Date(currentPeriod);
            periodEnd.setDate(periodEnd.getDate() + step - 1);
            // Tìm data tương ứng trong result
            const periodData = result.find((item) => item._id.getTime() === currentPeriod.getTime());
            formattedResult.push({
                period: `${(0, utils_1.formatDate)(currentPeriod)} - ${(0, utils_1.formatDate)(periodEnd)}`,
                startDate: currentPeriod.toISOString(),
                endDate: periodEnd.toISOString(),
                count: periodData ? periodData.count : 0,
            });
            // Chuyển sang period tiếp theo
            currentPeriod.setDate(currentPeriod.getDate() + step);
        }
        return formattedResult;
    });
}
function getUserProgressAnalyst() {
    return __awaiter(this, void 0, void 0, function* () {
        const totalUser = yield user_model_1.userModel.find({}).countDocuments();
        const premiumUser = yield user_model_1.userModel
            .find({
            upgradeExpiredDate: { $gt: new Date() },
        })
            .countDocuments();
        return { totalUser, premiumUser };
    });
}
exports.userSrv = {
    localCreate,
    localLogin,
    googleCreate,
    facebookCreate,
    getById,
    updateProfile,
    updateAvatar,
    updateTargetScore,
    getAllUsers,
    getUpgradeUsers,
    getNewUserAnalyst,
    getUpgradeUserAnalyst,
    getUserProgressAnalyst,
};
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.hash(password, parseInt(const_1.constEnv.passwordSalt));
    });
}
