import axios from "axios";
import { type User } from "./AuthContext";
import { type Notification } from "../types/Notification/Notification";
import { type Message } from "../types/Chat/Message";
import React, { createContext, useContext, useState } from "react";


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



interface EmergencyContextType {
  currentEmergency: EmergencyRequest | null;
  setCurrentEmergency: (emergency: EmergencyRequest | null) => void;
  createEmergencyRequest: (data: EmergencyRequest) => Promise<EmergencyRequest>;
  emergencyRequests: () => Promise<EmergencyRequest[]>;
  showVetEmergencyRequests: (id: number) => Promise<User>;
  showNotifications: () => Promise<Notification[]>;
  aceptEmergencyRequest: (id: number) => Promise<string>;
  readNotification: (id: string) => Promise<void>;
  messages: (id: number) => Promise<Message[]>;
  sendMessage: (message: Partial<Message>) => Promise<Message>;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(
  undefined
);

export function EmergencyProvider({ children }: { children: React.ReactNode }) {

  const [currentEmergency, setCurrentEmergency] = useState<EmergencyRequest | null>(null)


  const createEmergencyRequest = async (
    data: EmergencyRequest
  ): Promise<EmergencyRequest> => {
    try {
      console.log("Creating emergency request with data:", data);
      console.log("Token:", localStorage.getItem("auth_token"));

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/emergency-requests`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      const resData = response.data.data;

      return {
        ...resData,
        weight: parseFloat(resData.weight), // Convertir "25kg" → 25
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error creando la emergencia";
      return Promise.reject(new Error(message));
    }
  };

  const emergencyRequests = async (): Promise<EmergencyRequest[]> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/emergency-requests/my`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      let i = 1;
      console.log("Emergency requests response:", response.data.data, i++);

      return response.data.data;

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Error creando la emergencia";
        return Promise.reject(new Error(message));
      }
      return Promise.reject(error);
    }
  };
  const showVetEmergencyRequests = async (id: number): Promise<User> => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        }
      })

      return response.data;

    } catch (error) {
      let errorMessage = "Error al obtener las solicitudes de emergencia del veterinario";

      if (axios.isAxiosError(error)) {
        // Si la API devuelve un mensaje en la respuesta, lo usamos
        errorMessage =
          (error.response?.data as { message?: string })?.message ||
          error.message ||
          errorMessage;

        console.error("Error fetching vet emergency requests:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }

      return Promise.reject(new Error(errorMessage));

    }

  }

  const showNotifications = async (): Promise<Notification[]> => {
    try {
      // Obtener las notificaciones no leídas del usuario
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/notifications/unread`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        }
      });
      return response.data;

    } catch (error: unknown) {
      let errorMessage = "Error al obtener las notificaciones";

      if (axios.isAxiosError(error)) {
        // Si la API devuelve un mensaje en la respuesta, lo usamos
        errorMessage =
          (error.response?.data as { message?: string })?.message ||
          error.message ||
          errorMessage;

        console.error("Error fetching notifications:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }

      return Promise.reject(new Error(errorMessage));

    }

  }

  const aceptEmergencyRequest = async (id: number): Promise<string> => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/emergency-requests/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          }
        },)

      return response.data.message;
    } catch (error: unknown) {
      let errorMessage = "Error al aceptar la solicitud de emergencia";

      if (axios.isAxiosError(error)) {
        // Si la API devuelve un mensaje en la respuesta, lo usamos
        errorMessage =
          (error.response?.data as { message?: string })?.message ||
          error.message ||
          errorMessage;

        console.error("Error accepting emergency request:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }

      return Promise.reject(new Error(errorMessage));

    }
  }
  const readNotification = async (id: string): Promise<void> => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/notifications/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      console.log("Notification read successfully:", response.data);
    } catch (error: unknown) {
      let errorMessage = "Error al eliminar la notificación";
      if (axios.isAxiosError(error)) {
        // Si la API devuelve un mensaje en la respuesta, lo usamos
        errorMessage =
          (error.response?.data as { message?: string })?.message ||
          error.message ||
          errorMessage;

        console.error("Error delete notification:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      return Promise.reject(new Error(errorMessage));
    }
  };
  const messages = async (id: number): Promise<Message[]> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/private-chat/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Error creando la emergencia";
        return Promise.reject(new Error(message));
      }
      return Promise.reject(error);
    }
  };
  const sendMessage = async (message: Partial<Message>): Promise<Message> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/message`,
        message,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Error enviando el mensaje";
        return Promise.reject(new Error(message));
      }
      return Promise.reject(error);
    }
  };



  return (
    <EmergencyContext.Provider
      value={{ createEmergencyRequest, emergencyRequests, currentEmergency, setCurrentEmergency, showVetEmergencyRequests, showNotifications, aceptEmergencyRequest, readNotification, messages, sendMessage }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error("useEmergency must be used within an EmergencyProvider");
  }
  return context;
}
