import express, { Request, Response } from "express";
import { handleAsync } from "../../../middlewares/handle_async";
import BridgeNestCtrl from "../../../controllers/bridge_nest";

const bridgeNestRouter = express.Router()

bridgeNestRouter.post('/create-room-in-db', handleAsync(BridgeNestCtrl.createRoomInDb))

bridgeNestRouter.post('/:roomId/with-livekit', handleAsync(BridgeNestCtrl.createRoomWithLivekit))

bridgeNestRouter.post('/:roomId/close', handleAsync(BridgeNestCtrl.closeRoom))

bridgeNestRouter.post('/:roomName/join', handleAsync(BridgeNestCtrl.joinRoom))


export default bridgeNestRouter;