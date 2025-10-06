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
const toeic_test_session_1 = __importDefault(require("../../services/toeic_test_session"));
const utils_1 = require("../../utils");
var ToeicTestSessionCtrl;
(function (ToeicTestSessionCtrl) {
    function create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { testId, toeicTestId } = req.body;
                const session = yield toeic_test_session_1.default.createSessionWithRegistrations(testId, toeicTestId);
                res.status(201).json({
                    success: true,
                    data: session,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: "Failed to create test session",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    ToeicTestSessionCtrl.create = create;
    function getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const { sessions, total } = yield toeic_test_session_1.default.getAll(page, limit);
                res.status(200).json({
                    success: true,
                    data: sessions,
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
                    message: "Failed to fetch test sessions",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    ToeicTestSessionCtrl.getAll = getAll;
    function getSessionByUserIdAndId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const userId = req.user.id;
                const { id } = req.params;
                const session = yield toeic_test_session_1.default.getSessionByUserIdAndId(userId, id);
                res.status(200).json(session);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Failed to fetch session" });
            }
        });
    }
    ToeicTestSessionCtrl.getSessionByUserIdAndId = getSessionByUserIdAndId;
    function getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const session = yield toeic_test_session_1.default.getById(id);
                if (!session) {
                    return res.status(404).json({
                        success: false,
                        message: "Test session not found",
                    });
                }
                res.status(200).json({
                    success: true,
                    data: session,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch test session",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    ToeicTestSessionCtrl.getById = getById;
    function update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const session = yield toeic_test_session_1.default.update(id, req.body);
                if (!session) {
                    return res.status(404).json({
                        success: false,
                        message: "Test session not found",
                    });
                }
                res.status(200).json({
                    success: true,
                    data: session,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to update test session",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    ToeicTestSessionCtrl.update = update;
    function deleteSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const success = yield toeic_test_session_1.default.delete(id);
                if (!success) {
                    return res.status(404).json({
                        success: false,
                        message: "Test session not found",
                    });
                }
                res.status(200).json({
                    success: true,
                    message: "Test session deleted successfully",
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to delete test session",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    ToeicTestSessionCtrl.deleteSession = deleteSession;
    function addParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { userId } = req.body;
                const session = yield toeic_test_session_1.default.addParticipant(id, userId);
                res.status(200).json({
                    success: true,
                    data: session,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: "Failed to add participant",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    ToeicTestSessionCtrl.addParticipant = addParticipant;
    function removeParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { userId } = req.body;
                const session = yield toeic_test_session_1.default.removeParticipant(id, userId);
                res.status(200).json({
                    success: true,
                    data: session,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: "Failed to remove participant",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    ToeicTestSessionCtrl.removeParticipant = removeParticipant;
    function getSessionsByTestId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { testId } = req.params;
                const sessions = yield toeic_test_session_1.default.getSessionsByTestId(testId);
                res.status(200).json({
                    success: true,
                    data: sessions,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch test sessions",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    ToeicTestSessionCtrl.getSessionsByTestId = getSessionsByTestId;
    function getSessionsByTestingId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { testingId } = req.params;
                const sessions = yield toeic_test_session_1.default.getSessionsByTestingId(testingId);
                res.status(200).json({
                    success: true,
                    data: sessions,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch test sessions",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    ToeicTestSessionCtrl.getSessionsByTestingId = getSessionsByTestingId;
    function getSessionsByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const paginationParams = (0, utils_1.getPaginationParams)(req.query);
                const { sessions, total } = yield toeic_test_session_1.default.getSessionsByUserId(userId, paginationParams);
                res.status(200).json({
                    success: true,
                    data: sessions,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch test sessions",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    ToeicTestSessionCtrl.getSessionsByUserId = getSessionsByUserId;
    function getMySessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const userId = req.user.id;
                const paginationParams = (0, utils_1.getPaginationParams)(req.query);
                const { sessions, total } = yield toeic_test_session_1.default.getSessionsByUserId(userId, paginationParams);
                res
                    .status(200)
                    .json((0, utils_1.createPaginatedResponse)(sessions, total, paginationParams));
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch your test sessions",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    ToeicTestSessionCtrl.getMySessions = getMySessions;
    function getExamByToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.query;
                const { test, exam } = yield toeic_test_session_1.default.getExamByToken(token);
                res.status(200).json(test);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch exam",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    ToeicTestSessionCtrl.getExamByToken = getExamByToken;
})(ToeicTestSessionCtrl || (ToeicTestSessionCtrl = {}));
exports.default = ToeicTestSessionCtrl;
