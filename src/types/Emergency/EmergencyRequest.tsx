export interface EmergencyRequest {
    id?: number;
    client_id?: number;
    client_name?: string;
    assigned_vet_id?: number;
    vet_name?: string;
    species: string;
    weight: string;
    breed: string;
    symptoms: string;
    description: string;
    status?: "pending" | "accepted" | "rejected" | "completed";
    chat_id?: number;
    sent_at?: string;
    created_at?: string;
    updated_at?: string;
}