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
const bad_request_error_1 = require("../../errors/bad_request_error");
const user_model_1 = require("../../models/user.model");
const bridge_nest_1 = require("../../services/bridge_nest");
var BridgeNestCtrl;
(function (BridgeNestCtrl) {
    BridgeNestCtrl.createRoomInDb = (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const userId = req.user.id;
        if (!userId) {
            throw new bad_request_error_1.BadRequestError("User not found");
        }
        const user = yield user_model_1.userModel.findById(userId);
        if (!user) {
            throw new bad_request_error_1.BadRequestError("User not found");
        }
        const createRoomInDbAttr = {
            name: req.body.name,
            description: req.body.description,
            thumbnail: req.body.thumbnail,
            hostEmail: (_a = user.email) !== null && _a !== void 0 ? _a : null,
            hostUserId: user.id,
            hostUsername: (_b = user.name) !== null && _b !== void 0 ? _b : null,
            hostAvatarUrl: (_c = user.avatar) !== null && _c !== void 0 ? _c : null,
        };
        const roomInDb = yield (0, bridge_nest_1.createRoomInDbSrv)(createRoomInDbAttr);
        return res.status(200).json(roomInDb);
    });
    BridgeNestCtrl.createRoomWithLivekit = (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const roomId = req.params.roomId;
            const roomInDb = yield (0, bridge_nest_1.createRoomWithLivekitSrv)(roomId);
            return res.status(200).json(roomInDb);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to create room with livekit",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    });
    BridgeNestCtrl.closeRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        const roomInDb = yield (0, bridge_nest_1.closeRoomSrv)(roomId);
        return res.status(200).json(roomInDb);
    });
    BridgeNestCtrl.joinRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
        const roomName = req.params.roomName;
        const userId = req.body.userId;
        const username = req.body.username;
        const avatarUrl = req.body.avatarUrl;
        const roomInDb = yield (0, bridge_nest_1.joinRoomSrv)(roomName, userId, username, avatarUrl);
        return res.status(200).json(roomInDb);
    });
})(BridgeNestCtrl || (BridgeNestCtrl = {}));
exports.default = BridgeNestCtrl;
