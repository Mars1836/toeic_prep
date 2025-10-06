"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const test_model_1 = require("../../models/test.model");
const XLSX = __importStar(require("xlsx"));
const utils_1 = require("../../utils");
const configs_1 = require("../../configs");
function getImage(name, code) {
    if (!name || name === "") {
        return null;
    }
    return configs_1.ORIGIN + `/uploads/images/${code}/${name}.jpg`;
}
function getAudio(name, code) {
    if (!name || name === "") {
        return null;
    }
    return configs_1.ORIGIN + `/uploads/audios/${code}/${name}.mp3`;
}
var TestSrv;
(function (TestSrv) {
    function create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTest = yield test_model_1.testModel.create(data);
            return newTest;
        });
    }
    TestSrv.create = create;
    function getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [
                // Stage 1: Lookup để join với collection results
                {
                    $lookup: {
                        from: "results",
                        localField: "_id",
                        foreignField: "testId",
                        as: "results",
                    },
                },
                // Stage 2: Thêm trường attemptCount và userAttempt
                {
                    $addFields: {
                        attemptCount: { $size: "$results" },
                    },
                },
                // Stage 3: Project để chọn các trường cần thiết và format
                {
                    $project: {
                        _id: 0,
                        id: "$_id",
                        title: 1,
                        type: 1,
                        code: 1,
                        parts: 1,
                        numberOfParts: 1,
                        numberOfQuestions: 1,
                        duration: 1,
                        difficulty: 1,
                        isPublished: 1,
                        attemptCount: 1,
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
                // Stage 4: Sort theo số lượt làm bài
                {
                    $sort: { "userAttempt.lastSubmit": -1, createdAt: -1 },
                },
            ];
            // Thêm $skip và $limit nếu có
            // Thực hiện query
            const tests = yield test_model_1.testModel.aggregate(pipeline);
            return tests;
        });
    }
    TestSrv.getAll = getAll;
    function getByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield test_model_1.testModel.findOne({
                code: code,
            });
            return rs;
        });
    }
    TestSrv.getByCode = getByCode;
    function getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield test_model_1.testModel.findById(id);
            return rs;
        });
    }
    TestSrv.getById = getById;
    function getByQuery(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let { skip = 0, limit = 4 } = query, filters = __rest(query, ["skip", "limit"]);
            skip = Number(skip);
            limit = Number(limit);
            const pipeline = [
                {
                    $match: {
                        isPublished: true,
                    },
                },
                // Stage 1: Lookup để join với collection results
                {
                    $lookup: {
                        from: "results",
                        localField: "_id",
                        foreignField: "testId",
                        as: "results",
                    },
                },
                // Stage 2: Thêm trường attemptCount và userAttempt
                {
                    $addFields: {
                        attemptCount: { $size: "$results" },
                        userAttempt: {
                            $let: {
                                vars: {
                                    userResults: {
                                        $filter: {
                                            input: "$results",
                                            as: "result",
                                            cond: {
                                                $eq: [
                                                    "$$result.userId",
                                                    userId ? new mongoose_1.default.Types.ObjectId(userId) : null,
                                                ],
                                            },
                                        },
                                    },
                                },
                                in: {
                                    count: { $size: "$$userResults" },
                                    lastTime: {
                                        $max: "$$userResults.createdAt",
                                    },
                                },
                            },
                        },
                    },
                },
                // Stage 3: Project để chọn các trường cần thiết và format
                {
                    $project: {
                        _id: 0,
                        id: "$_id",
                        title: 1,
                        type: 1,
                        code: 1,
                        parts: 1,
                        numberOfParts: 1,
                        numberOfQuestions: 1,
                        duration: 1,
                        difficulty: 1,
                        isPublished: 1,
                        attemptCount: 1,
                        userAttempt: 1,
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
                // Stage 4: Sort theo số lượt làm bài
                {
                    $sort: { "userAttempt.lastSubmit": -1, createdAt: -1 },
                },
            ];
            // Thêm $skip và $limit nếu có
            if (skip) {
                pipeline.push({ $skip: skip });
            }
            if (limit) {
                pipeline.push({ $limit: limit });
            }
            // Thêm $match cho id cụ thể nếu có
            if (query.id) {
                pipeline.unshift({
                    $match: { _id: new mongoose_1.default.Types.ObjectId(query.id) },
                });
            }
            // Thực hiện query
            const tests = yield test_model_1.testModel.aggregate(pipeline);
            return tests;
        });
    }
    TestSrv.getByQuery = getByQuery;
    function updateAll(updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield test_model_1.testModel.updateMany({}, Object.assign({}, updateData));
            return rs;
        });
    }
    TestSrv.updateAll = updateAll;
    function handleExcel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield test_model_1.testModel.findById(id);
            if (!rs) {
                throw new Error("Test not found");
            }
            const linkExcel = `http://localhost:4000/uploads/excels/${rs.code}/${rs.fileName}`;
            const response = yield fetch(linkExcel);
            const arrayBuffer = yield response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: "",
            });
            const list = [];
            if (jsonData.length > 1) {
                const header = jsonData[0];
                for (let i = 1; i < jsonData.length; i++) {
                    const arr = jsonData[i];
                    const questionItem = {
                        id: arr[0],
                        [header[0]]: arr[0] || null,
                        [header[1]]: arr[1] || null,
                        [header[2]]: arr[2] || null,
                        [header[3]]: arr[3] || null,
                        [header[4]]: arr[4] || null,
                        [header[5]]: arr[5] || null,
                        [header[6]]: arr[6] || null,
                        [header[7]]: arr[7] || null,
                        [header[8]]: arr[8] || null,
                        [header[9]]: arr[9] || null,
                    };
                    questionItem.image = getImage(questionItem.image || "", rs.code);
                    questionItem.audio = getAudio(questionItem.audio || "", rs.code);
                    const filteredQuestionItem = (0, utils_1.cleanNullFieldObject)(questionItem);
                    const options = [arr[5], arr[6], arr[7], arr[8]];
                    const labels = ["A", "B", "C", "D"];
                    // @ts-ignore
                    filteredQuestionItem.options = options
                        .map((op, index) => {
                        if (!op) {
                            return null;
                        }
                        return {
                            id: labels[index],
                            content: op,
                        };
                    })
                        .filter((option) => option !== null);
                    list.push(filteredQuestionItem);
                }
            }
            return list;
        });
    }
    TestSrv.handleExcel = handleExcel;
    function deleteTest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield test_model_1.testModel.findByIdAndDelete(id);
            return rs;
        });
    }
    TestSrv.deleteTest = deleteTest;
    function updateTest(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield test_model_1.testModel.findByIdAndUpdate(id, data);
            return rs;
        });
    }
    TestSrv.updateTest = updateTest;
})(TestSrv || (TestSrv = {}));
exports.default = TestSrv;
