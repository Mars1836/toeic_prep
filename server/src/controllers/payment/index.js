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
const payment_1 = __importDefault(require("../../services/payment"));
var PaymentCtrl;
(function (PaymentCtrl) {
    function create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            const userId = req.user.id;
            const rs = yield payment_1.default.create(userId);
            res.status(201).json(rs);
        });
    }
    PaymentCtrl.create = create;
    function registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            const userId = req.user.id;
            const rs = yield payment_1.default.createTestRegistration(Object.assign({ userId }, req.body));
            res.status(201).json(rs);
        });
    }
    PaymentCtrl.registration = registration;
    function getStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const transId = req.query.transId;
            const rs = yield payment_1.default.getStatus(transId);
            res.status(200).json(rs);
        });
    }
    PaymentCtrl.getStatus = getStatus;
    function callback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield payment_1.default.callback(req.body);
            return rs;
        });
    }
    PaymentCtrl.callback = callback;
})(PaymentCtrl || (PaymentCtrl = {}));
exports.default = PaymentCtrl;
