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
const toeic_testing_1 = __importDefault(require("../../services/toeic_testing"));
const toeic_testing_model_1 = require("../../models/toeic_testing.model");
const utils_1 = require("../../utils");
var ToeicTestingCtrl;
(function (ToeicTestingCtrl) {
    function create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const toeicTesting = yield toeic_testing_1.default.create(req.body);
            res.status(201).json(toeicTesting);
        });
    }
    ToeicTestingCtrl.create = create;
    function createMany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tests } = req.body;
            if (!Array.isArray(tests)) {
                return res.status(400).json({
                    message: "Invalid request body. 'tests' must be an array",
                });
            }
            const toeicTestings = yield toeic_testing_1.default.createMany(tests);
            res.status(201).json(toeicTestings);
        });
    }
    ToeicTestingCtrl.createMany = createMany;
    function getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const paginationParams = (0, utils_1.getPaginationParams)(req.query);
            const { tests, total } = yield toeic_testing_1.default.getAll(paginationParams);
            res
                .status(200)
                .json((0, utils_1.createPaginatedResponse)(tests, total, paginationParams));
        });
    }
    ToeicTestingCtrl.getAll = getAll;
    function getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const toeicTesting = yield toeic_testing_1.default.getById(id);
            if (!toeicTesting) {
                return res.status(404).json({ message: "Test not found" });
            }
            res.status(200).json(toeicTesting);
        });
    }
    ToeicTestingCtrl.getById = getById;
    function getPendingTests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const paginationParams = (0, utils_1.getPaginationParams)(req.query);
            const { tests, total } = yield toeic_testing_1.default.getTestsByFilter({ status: toeic_testing_model_1.TestStatus.PENDING }, paginationParams);
            res
                .status(200)
                .json((0, utils_1.createPaginatedResponse)(tests, total, paginationParams));
        });
    }
    ToeicTestingCtrl.getPendingTests = getPendingTests;
    function getTestsByFilter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, isNotDone, isPending, isCompleted } = req.query;
            const paginationParams = (0, utils_1.getPaginationParams)(req.query);
            const filters = {};
            if (status) {
                filters.status = status;
            }
            if (isNotDone === "true") {
                filters.isNotDone = true;
            }
            if (isPending === "true") {
                filters.isPending = true;
            }
            if (isCompleted === "true") {
                filters.isCompleted = true;
            }
            const { tests, total } = yield toeic_testing_1.default.getTestsByFilter(filters, paginationParams);
            res
                .status(200)
                .json((0, utils_1.createPaginatedResponse)(tests, total, paginationParams));
        });
    }
    ToeicTestingCtrl.getTestsByFilter = getTestsByFilter;
    function getPendingTestsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            const userId = req.user.id;
            const paginationParams = (0, utils_1.getPaginationParams)(req.query);
            const { tests, total } = yield toeic_testing_1.default.getPendingTestsByUser(userId, paginationParams);
            res
                .status(200)
                .json((0, utils_1.createPaginatedResponse)(tests, total, paginationParams));
        });
    }
    ToeicTestingCtrl.getPendingTestsByUser = getPendingTestsByUser;
})(ToeicTestingCtrl || (ToeicTestingCtrl = {}));
exports.default = ToeicTestingCtrl;
