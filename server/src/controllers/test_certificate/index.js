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
const test_certificate_1 = __importDefault(require("../../services/test_certificate"));
var TestCertificateCtrl;
(function (TestCertificateCtrl) {
    function create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const certificate = yield test_certificate_1.default.create(req.body);
                res.status(201).json(certificate);
            }
            catch (error) {
                res.status(400).json({ message: "Failed to create certificate", error });
            }
        });
    }
    TestCertificateCtrl.create = create;
    function getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const certificates = yield test_certificate_1.default.getAll();
                res.status(200).json(certificates);
            }
            catch (error) {
                res.status(500).json({ message: "Failed to fetch certificates", error });
            }
        });
    }
    TestCertificateCtrl.getAll = getAll;
    function getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const certificate = yield test_certificate_1.default.getById(id);
                if (!certificate) {
                    return res.status(404).json({ message: "Certificate not found" });
                }
                res.status(200).json(certificate);
            }
            catch (error) {
                res.status(500).json({ message: "Failed to fetch certificate", error });
            }
        });
    }
    TestCertificateCtrl.getById = getById;
    function getByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const certificates = yield test_certificate_1.default.getByUserId(userId);
                res.status(200).json(certificates);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Failed to fetch user certificates", error });
            }
        });
    }
    TestCertificateCtrl.getByUserId = getByUserId;
    function updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status } = req.body;
                const certificate = yield test_certificate_1.default.updateStatus(id, status);
                if (!certificate) {
                    return res.status(404).json({ message: "Certificate not found" });
                }
                res.status(200).json(certificate);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Failed to update certificate status", error });
            }
        });
    }
    TestCertificateCtrl.updateStatus = updateStatus;
    function updateScore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { score } = req.body;
                const certificate = yield test_certificate_1.default.updateScore(id, score);
                if (!certificate) {
                    return res.status(404).json({ message: "Certificate not found" });
                }
                res.status(200).json(certificate);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Failed to update certificate score", error });
            }
        });
    }
    TestCertificateCtrl.updateScore = updateScore;
    function getValidCertificates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const certificates = yield test_certificate_1.default.getValidCertificates();
                res.status(200).json(certificates);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Failed to fetch valid certificates", error });
            }
        });
    }
    TestCertificateCtrl.getValidCertificates = getValidCertificates;
})(TestCertificateCtrl || (TestCertificateCtrl = {}));
exports.default = TestCertificateCtrl;
