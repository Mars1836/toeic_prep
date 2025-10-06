import axios from "axios";
import { CreateRoomInDbAttr } from "../../models/room.model";


export const createRoomInDbSrv = async (createRoomInDbAttr: CreateRoomInDbAttr) =>{
    try {
        const response = await axios.post('http://localhost:3000/api/v1/rooms', createRoomInDbAttr, {
            headers: {
            'Content-Type': 'application/json',
        }})
        return response.data
    } catch(err: any) {
        throw new Error('Error crear room in db: ' + err.message)
    }
}

export const createRoomWithLivekitSrv = async(roomId: string) => {
    try {
        // convert roomId to int
        const roomIdInt = parseInt(roomId)
        const response = await axios.post(`http://localhost:3000/api/v1/rooms/${roomIdInt}/with-livekit`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch(err: any) {
        throw new Error('Error crear room with livekit: ' + err.message)
    }
}

export const closeRoomSrv = async(roomId: string) => {
    try {
        const roomIdInt = parseInt(roomId)
        const response = await axios.post(`http://localhost:3000/api/v1/rooms/${roomIdInt}/close`, {}, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return response.data
    } catch(err: any) {
        throw new Error('Error crear room with livekit: ' + err.message)
    }
}


export const joinRoomSrv = async(roomName: string, userId: string, username: string, avatarUrl: string) => {
    try {
        const response = await axios.post(`http://localhost:3000/api/v1/rooms/${roomName}/join`, {
            userId: userId,
            username: username,
            avatarUrl: avatarUrl
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch(err: any) {
        throw new Error('Error crear room with livekit: ' + err.message)
    }
}
