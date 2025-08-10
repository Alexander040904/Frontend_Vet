import axios from 'axios'
import React, { createContext, useContext } from 'react'

export interface EmergencyRequest {
  id?: number
  client_id?: number
  assigned_vet_id?: number
  species: string
  weight: string
  breed: string
  symptoms: string
  description: string
  status?: 'pending' | 'accepted' | 'rejected' | 'completed'
  created_at?: string
  updated_at?: string
}

interface EmergencyContextType {
  createEmergencyRequest: (data: EmergencyRequest) => Promise<EmergencyRequest>
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined)

export function EmergencyProvider({ children }: { children: React.ReactNode }) {
  const createEmergencyRequest = async (data: EmergencyRequest): Promise<EmergencyRequest> => {
    try {
      console.log("Creating emergency request with data:", data);
      console.log('Token:', localStorage.getItem('auth_token'));
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/emergency-requests`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      )

      const resData = response.data.data

      return {
        ...resData,
        weight: parseFloat(resData.weight), // Convertir "25kg" → 25
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error creando la emergencia'
      return Promise.reject(new Error(message))
    }
  }

  return (
    <EmergencyContext.Provider value={{ createEmergencyRequest }}>
      {children}
    </EmergencyContext.Provider>
  )
}

export function useEmergency() {
  const context = useContext(EmergencyContext)
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider')
  }
  return context
}
