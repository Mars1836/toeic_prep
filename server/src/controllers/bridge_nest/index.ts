import { BadRequestError } from "../../errors/bad_request_error"
import { CreateRoomInDbAttr } from "../../models/room.model"
import { userModel } from "../../models/user.model"
import { closeRoomSrv, createRoomInDbSrv, createRoomWithLivekitSrv, joinRoomSrv } from "../../services/bridge_nest"
import { Request, Response } from "express"

namespace BridgeNestCtrl {
    export const createRoomInDb = async(req: Request, res: Response) => {
        const userId = req.user!.id
        if(!userId) {
            throw new BadRequestError("User not found")
        }
        const user = await userModel.findById(userId)
        if(!user) {
            throw new BadRequestError("User not found")
        }
        const createRoomInDbAttr: CreateRoomInDbAttr = {
            name: req.body.name,
            description: req.body.description,
            thumbnail: req.body.thumbnail,
            hostEmail: user.email ?? null,
            hostUserId: user.id,
            hostUsername: user.name ?? null,
            hostAvatarUrl: user.avatar ?? null,
        }
        const roomInDb = await createRoomInDbSrv(createRoomInDbAttr)
        return res.status(200).json(roomInDb)
    }

    export const createRoomWithLivekit = async(req: Request, res: Response) => {
        try {
            const roomId = req.params.roomId
            const roomInDb = await createRoomWithLivekitSrv(roomId)
            return res.status(200).json(roomInDb)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to create room with livekit",
                error: error instanceof Error ? error.message : "Unknown error",
            })
        }
    }

    export const closeRoom = async(req: Request, res: Response) => {
        const roomId = req.params.roomId
        const roomInDb = await closeRoomSrv(roomId)
        return res.status(200).json(roomInDb)
    }

    export const joinRoom = async(req: Request, res: Response) => {
        const roomName = req.params.roomName
        const userId = req.body.userId
        const username = req.body.username
        const avatarUrl = req.body.avatarUrl
        const roomInDb = await joinRoomSrv(roomName, userId, username, avatarUrl)
        return res.status(200).json(roomInDb)
    }
}

export default BridgeNestCtrl