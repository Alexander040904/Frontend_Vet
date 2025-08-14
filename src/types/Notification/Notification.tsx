
import { type EmergencyRequest } from "../Emergency/EmergencyRequest";

export interface Notification {
    id?: string;
    notifiable_id: number;
    read_at?: string
    data?: EmergencyRequest

}


export interface UpdateNotification {
    id?: string;

}