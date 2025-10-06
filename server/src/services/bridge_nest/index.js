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
exports.joinRoomSrv = exports.closeRoomSrv = exports.createRoomWithLivekitSrv = exports.createRoomInDbSrv = void 0;
const axios_1 = __importDefault(require("axios"));
const createRoomInDbSrv = (createRoomInDbAttr) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post('http://localhost:3000/api/v1/rooms', createRoomInDbAttr, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    }
    catch (err) {
        throw new Error('Error crear room in db: ' + err.message);
    }
});
exports.createRoomInDbSrv = createRoomInDbSrv;
const createRoomWithLivekitSrv = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // convert roomId to int
        const roomIdInt = parseInt(roomId);
        const response = yield axios_1.default.post(`http://localhost:3000/api/v1/rooms/${roomIdInt}/with-livekit`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }
    catch (err) {
        throw new Error('Error crear room with livekit: ' + err.message);
    }
});
exports.createRoomWithLivekitSrv = createRoomWithLivekitSrv;
const closeRoomSrv = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomIdInt = parseInt(roomId);
        const response = yield axios_1.default.post(`http://localhost:3000/api/v1/rooms/${roomIdInt}/close`, {}, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    }
    catch (err) {
        throw new Error('Error crear room with livekit: ' + err.message);
    }
});
exports.closeRoomSrv = closeRoomSrv;
const joinRoomSrv = (roomName, userId, username, avatarUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`http://localhost:3000/api/v1/rooms/${roomName}/join`, {
            userId: userId,
            username: username,
            avatarUrl: avatarUrl
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }
    catch (err) {
        throw new Error('Error crear room with livekit: ' + err.message);
    }
});
exports.joinRoomSrv = joinRoomSrv;
