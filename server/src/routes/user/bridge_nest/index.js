"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const bridge_nest_1 = __importDefault(require("../../../controllers/bridge_nest"));
const bridgeNestRouter = express_1.default.Router();
bridgeNestRouter.post('/create-room-in-db', (0, handle_async_1.handleAsync)(bridge_nest_1.default.createRoomInDb));
bridgeNestRouter.post('/:roomId/with-livekit', (0, handle_async_1.handleAsync)(bridge_nest_1.default.createRoomWithLivekit));
bridgeNestRouter.post('/:roomId/close', (0, handle_async_1.handleAsync)(bridge_nest_1.default.closeRoom));
bridgeNestRouter.post('/:roomName/join', (0, handle_async_1.handleAsync)(bridge_nest_1.default.joinRoom));
exports.default = bridgeNestRouter;
