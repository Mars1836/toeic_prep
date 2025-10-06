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
const zalopay_1 = require("../../configs/zalopay");
const utils_1 = require("../../utils");
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const qs_1 = __importDefault(require("qs"));
const bad_request_error_1 = require("../../errors/bad_request_error");
const repos_1 = __importDefault(require("../user/repos"));
const transaction_1 = __importDefault(require("../transaction"));
const enum_1 = require("../../configs/enum");
const firebase_1 = require("../../configs/firebase");
const toeic_testing_model_1 = require("../../models/toeic_testing.model");
const test_registration_1 = __importDefault(require("../test_registration"));
var PaymentSrv;
(function (PaymentSrv) {
    function getServerUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.PLATFORM !== "WEB") {
                const snapshotServerUrl = yield (0, firebase_1.get)((0, firebase_1.ref)(firebase_1.firebase, "ngrok/url1"));
                return snapshotServerUrl.val() || "http://localhost:4000";
            }
            const snapshotServerUrl = yield (0, firebase_1.get)((0, firebase_1.ref)(firebase_1.firebase, "webclient/server"));
            return snapshotServerUrl.val() || "http://localhost:4000";
        });
    }
    function getClientUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshotClientUrl = yield (0, firebase_1.get)((0, firebase_1.ref)(firebase_1.firebase, "webclient/client"));
            return snapshotClientUrl.val() || "http://localhost:3000";
        });
    }
    function create(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = [
                { userId: userId, upgradeFor: 30, type: enum_1.TransactionType.upgrade_account },
            ];
            console.log('winter upgrade premium');
            const transID = Math.floor(Math.random() * 1000000);
            let origin;
            let clientUrl;
            origin = yield getServerUrl();
            clientUrl = yield getClientUrl();
            const order = {
                app_id: zalopay_1.configZalo.app_id,
                app_trans_id: `${(0, moment_1.default)().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
                app_user: userId,
                app_time: Date.now(), // miliseconds
                item: JSON.stringify(items),
                embed_data: JSON.stringify({ redirectUrl: clientUrl }),
                amount: 5000,
                description: `UPGRADE - Payment for the upgrade account #${transID}`,
                callback_url: zalopay_1.configZalo.callbackUrl(origin),
                bank_code: "",
                mac: "",
            };
            const newTransaction = yield transaction_1.default.create({
                userId: userId,
                type: enum_1.TransactionType.upgrade_account,
                amount: order.amount,
                currency: "VND",
                description: `Toeic - Payment for the upgrade account #${transID}`,
                providerId: order.app_trans_id,
                status: enum_1.TransactionStatus.pending,
            });
            const data = zalopay_1.configZalo.app_id +
                "|" +
                order.app_trans_id +
                "|" +
                order.app_user +
                "|" +
                order.amount +
                "|" +
                order.app_time +
                "|" +
                order.embed_data +
                "|" +
                order.item;
            order.mac = (0, utils_1.generateMac)(data, zalopay_1.configZalo.key1);
            const rs = yield axios_1.default.post(zalopay_1.configZalo.endpointCreate, null, {
                params: order,
            });
            const datars = rs.data;
            datars.trans_id = order.app_trans_id;
            datars.callbackUrl = zalopay_1.configZalo.callbackUrl(origin);
            return datars;
        });
    }
    PaymentSrv.create = create;
    function createTestRegistration(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const toeicTest = yield toeic_testing_model_1.toeicTestingModel.findById(payload.examId);
            if (!toeicTest) {
                throw new bad_request_error_1.BadRequestError("Kỳ thi không tồn tại");
            }
            const items = [
                {
                    userId: payload.userId,
                    toeicTestId: payload.examId,
                    type: enum_1.TransactionType.test_registration,
                    data: JSON.stringify(payload),
                },
            ];
            const transID = Math.floor(Math.random() * 1000000);
            let origin;
            let clientUrl;
            origin = yield getServerUrl();
            clientUrl = yield getClientUrl();
            const order = {
                app_id: zalopay_1.configZalo.app_id,
                app_trans_id: `${(0, moment_1.default)().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
                app_user: payload.userId,
                app_time: Date.now(), // miliseconds
                item: JSON.stringify(items),
                embed_data: JSON.stringify({ redirectUrl: clientUrl }),
                amount: toeicTest.price,
                description: `REGISTRATION - Payment for the test registration #${transID}`,
                callback_url: zalopay_1.configZalo.callbackUrl(origin),
                bank_code: "",
                mac: "",
            };
            console.log(zalopay_1.configZalo.callbackUrl(origin));
            const newTransaction = yield transaction_1.default.create({
                userId: payload.userId,
                type: enum_1.TransactionType.test_registration,
                amount: order.amount,
                currency: "VND",
                description: `Toeic - Payment for the test registration #${transID}`,
                providerId: order.app_trans_id,
                status: enum_1.TransactionStatus.pending,
            });
            const data = zalopay_1.configZalo.app_id +
                "|" +
                order.app_trans_id +
                "|" +
                order.app_user +
                "|" +
                order.amount +
                "|" +
                order.app_time +
                "|" +
                order.embed_data +
                "|" +
                order.item;
            order.mac = (0, utils_1.generateMac)(data, zalopay_1.configZalo.key1);
            const rs = yield axios_1.default.post(zalopay_1.configZalo.endpointCreate, null, {
                params: order,
            });
            const datars = rs.data;
            datars.trans_id = order.app_trans_id;
            datars.callbackUrl = zalopay_1.configZalo.callbackUrl(origin);
            return datars;
        });
    }
    PaymentSrv.createTestRegistration = createTestRegistration;
    function callback(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = {
                return_code: -1,
                return_message: "",
                data: {},
            };
            let dataStr = data.data;
            let reqMac = data.mac;
            let mac = (0, utils_1.generateMac)(dataStr, zalopay_1.configZalo.key2);
            console.log('winter callback');
            // kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if (reqMac !== mac) {
                // callback không hợp lệ
                throw new bad_request_error_1.BadRequestError("mac not equal");
            }
            else {
                console.log("callback success");
                // thanh toán thành công
                // merchant cập nhật trạng thái cho đơn hàng ở đây
                let dataJson = JSON.parse(dataStr);
                result.return_code = 1;
                result.return_message = "success";
                result.data = dataJson;
                console.log("dataJson: ");
                let item = JSON.parse(dataJson.item);
                console.log("item: ");
                console.log(item);
                item.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    if (item.type === enum_1.TransactionType.upgrade_account) {
                        yield repos_1.default.upgrade(item.userId);
                    }
                    else if (item.type === enum_1.TransactionType.test_registration) {
                        yield test_registration_1.default.create(JSON.parse(item.data));
                    }
                }));
                yield transaction_1.default.updateByProviderId(dataJson.app_trans_id, {
                    status: enum_1.TransactionStatus.success,
                });
                return result;
            }
        });
    }
    PaymentSrv.callback = callback;
    function getStatus(transId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!transId) {
                throw new bad_request_error_1.BadRequestError("transId is required");
            }
            let postData = {
                app_id: zalopay_1.configZalo.app_id,
                app_trans_id: transId, // Input your app_trans_id
                mac: "",
            };
            let data = postData.app_id + "|" + postData.app_trans_id + "|" + zalopay_1.configZalo.key1; // appid|app_trans_id|key1
            postData.mac = (0, utils_1.generateMac)(data, zalopay_1.configZalo.key1);
            let postConfig = {
                method: "post",
                url: zalopay_1.configZalo.endpointQuery,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: qs_1.default.stringify(postData),
            };
            try {
                const rs = yield (0, axios_1.default)(postConfig);
                if (rs.data.return_code === 1) {
                    rs.data.status = enum_1.TransactionStatus.success;
                }
                else if (rs.data.return_code === 2) {
                    rs.data.status = enum_1.TransactionStatus.failed;
                }
                else {
                    rs.data.status = enum_1.TransactionStatus.pending;
                }
                return rs.data;
            }
            catch (error) {
                throw new bad_request_error_1.BadRequestError("Fetch zalo to query status get error!");
            }
        });
    }
    PaymentSrv.getStatus = getStatus;
})(PaymentSrv || (PaymentSrv = {}));
exports.default = PaymentSrv;
