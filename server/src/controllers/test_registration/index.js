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
const test_registration_1 = __importDefault(require("../../services/test_registration"));
var TestRegistrationCtrl;
(function (TestRegistrationCtrl) {
    function create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const userId = req.user.id;
                const examId = req.body.examId;
                const registration = yield test_registration_1.default.create({
                    userId,
                    examId,
                    personalInfo: req.body.personalInfo,
                });
                res.status(201).json({
                    success: true,
                    data: registration,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: "Failed to create registration",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    TestRegistrationCtrl.create = create;
    function getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const { registrations, total } = yield test_registration_1.default.getAll(page, limit);
                res.status(200).json({
                    success: true,
                    data: registrations,
                    pagination: {
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit),
                    },
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch registrations",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    TestRegistrationCtrl.getAll = getAll;
    function getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const registration = yield test_registration_1.default.getById(id);
                if (!registration) {
                    return res.status(404).json({
                        success: false,
                        message: "Registration not found",
                    });
                }
                res.status(200).json({
                    success: true,
                    data: registration,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch registration",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    TestRegistrationCtrl.getById = getById;
    function getByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const userId = req.user.id;
                const registrations = yield test_registration_1.default.getByUserId(userId);
                res.status(200).json({
                    success: true,
                    data: registrations,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch user registrations",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    TestRegistrationCtrl.getByUserId = getByUserId;
    function getUpcomingRegistrations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const userId = req.user.id;
                const registrations = yield test_registration_1.default.getUpcomingRegistrations();
                res.status(200).json({
                    success: true,
                    data: registrations,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch upcoming registrations",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    TestRegistrationCtrl.getUpcomingRegistrations = getUpcomingRegistrations;
    function updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status } = req.body;
                const registration = yield test_registration_1.default.updateStatus(id, status);
                if (!registration) {
                    return res.status(404).json({
                        success: false,
                        message: "Registration not found",
                    });
                }
                res.status(200).json({
                    success: true,
                    data: registration,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to update registration status",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    TestRegistrationCtrl.updateStatus = updateStatus;
    function getRegistrationsByDateRange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                if (!startDate || !endDate) {
                    return res.status(400).json({
                        success: false,
                        message: "Start date and end date are required",
                    });
                }
                const registrations = yield test_registration_1.default.getRegistrationsByDateRange(startDate, endDate);
                res.status(200).json({
                    success: true,
                    data: registrations,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch registrations by date range",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    TestRegistrationCtrl.getRegistrationsByDateRange = getRegistrationsByDateRange;
    function cancelRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const registration = yield test_registration_1.default.getById(id);
                if (!registration) {
                    return res.status(404).json({
                        success: false,
                        message: "Registration not found",
                    });
                }
                const updatedRegistration = yield test_registration_1.default.updateStatus(id, "CANCELLED");
                res.status(200).json({
                    success: true,
                    data: updatedRegistration,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to cancel registration",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    TestRegistrationCtrl.cancelRegistration = cancelRegistration;
    function getRegistrationsByStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status } = req.params;
                const registrations = yield test_registration_1.default.getRegistrationsByStatus(status);
                res.status(200).json({
                    success: true,
                    data: registrations,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch registrations by status",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    TestRegistrationCtrl.getRegistrationsByStatus = getRegistrationsByStatus;
    function getRegistrationsByTestCenter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { testCenter } = req.params;
                const registrations = yield test_registration_1.default.getRegistrationsByTestCenter(testCenter);
                res.status(200).json({
                    success: true,
                    data: registrations,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch registrations by test center",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    TestRegistrationCtrl.getRegistrationsByTestCenter = getRegistrationsByTestCenter;
})(TestRegistrationCtrl || (TestRegistrationCtrl = {}));
exports.default = TestRegistrationCtrl;
