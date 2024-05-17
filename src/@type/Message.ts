import { UnitRoom } from "./Organization"

export interface LatestMessageConversation {
    id: String,
    content: String,
    type: Number,
    user_send_id: String,
    conversation_id: String,
    createdAt: Date
}

export interface UserSend {
    id: String,
    name: String,
    avatar: String | null,
    unitRoom: UnitRoom
}