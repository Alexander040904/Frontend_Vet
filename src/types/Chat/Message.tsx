export interface Message {
    id?: number;
    private_chat_id: number;
    sender_id: number
    message: string;
    created_at?: string;
    updated_at?: string;

}

