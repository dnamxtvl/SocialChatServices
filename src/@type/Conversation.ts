import { Url } from "url";

export interface Conversation {
    id: string;
    name: string;
    avatar: Array<Url> | null;
    created_at: Date;
}