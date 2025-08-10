import axios from "axios";
import React, { createContext, useContext, useState } from "react";

export interface EmergencyRequest {
  id?: number;
  client_id?: number;
  assigned_vet_id?: number;
  species: string;
  weight: string;
  breed: string;
  symptoms: string;
  description: string;
  status?: "pending" | "accepted" | "rejected" | "completed";
  sent_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface EmergencyContextType {
  currentEmergency: EmergencyRequest | null;
  setCurrentEmergency: (emergency: EmergencyRequest | null) => void;
  createEmergencyRequest: (data: EmergencyRequest) => Promise<EmergencyRequest>;
  emergencyRequests: () => Promise<EmergencyRequest[]>;
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

  return (
    <EmergencyContext.Provider
      value={{ createEmergencyRequest, emergencyRequests, currentEmergency, setCurrentEmergency }}
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
