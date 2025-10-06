

export interface CreateRoomInDbAttr {
    name: string
    description: string | null
    thumbnail: string | null
    hostEmail: string | null
    hostUserId: string
    hostUsername: string
    hostAvatarUrl: string | null
}