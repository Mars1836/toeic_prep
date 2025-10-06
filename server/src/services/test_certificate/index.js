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
const test_certificate_model_1 = require("../../models/test_certificate.model");
const TestCertificateSrv = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const certificate = yield test_certificate_model_1.TestCertificate.create(data);
            return certificate;
        });
    },
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const certificates = yield test_certificate_model_1.TestCertificate.find()
                .populate("userId", "fullName email")
                .populate("testId", "testId testDate");
            return certificates;
        });
    },
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const certificate = yield test_certificate_model_1.TestCertificate.findById(id)
                .populate("userId", "fullName email")
                .populate("testId", "testId testDate");
            return certificate;
        });
    },
    getByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const certificates = yield test_certificate_model_1.TestCertificate.find({ userId }).populate("testId", "testId testDate");
            return certificates;
        });
    },
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const certificate = yield test_certificate_model_1.TestCertificate.findByIdAndUpdate(id, { status }, { new: true });
            return certificate;
        });
    },
    updateScore(id, score) {
        return __awaiter(this, void 0, void 0, function* () {
            const certificate = yield test_certificate_model_1.TestCertificate.findByIdAndUpdate(id, { score }, { new: true });
            return certificate;
        });
    },
    getValidCertificates() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            const certificates = yield test_certificate_model_1.TestCertificate.find({
                status: "issued",
                expiryDate: { $gt: currentDate },
            }).populate("userId", "fullName email");
            return certificates;
        });
    },
};
exports.default = TestCertificateSrv;
