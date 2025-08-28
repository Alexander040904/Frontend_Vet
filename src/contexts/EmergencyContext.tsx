'use client'

import React, { createContext, useContext, useState } from 'react'

export interface Pet {
  species: string
  weight: number
  breed: string
  symptoms: string
  description: string
}

export interface EmergencyRequest {
  id: string
  clientId: string
  clientName: string
  pet: Pet
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  veterinarianId?: string
  veterinarianName?: string
  createdAt: Date
  messages: Message[]
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
}

interface EmergencyContextType {
  emergencyRequests: EmergencyRequest[]
  currentEmergency: EmergencyRequest | null
  createEmergencyRequest: (pet: Pet, clientId: string, clientName: string) => string
  acceptEmergencyRequest: (requestId: string, veterinarianId: string, veterinarianName: string) => void
  rejectEmergencyRequest: (requestId: string) => void
  sendMessage: (requestId: string, senderId: string, senderName: string, content: string) => void
  setCurrentEmergency: (emergency: EmergencyRequest | null) => void
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined)

export function EmergencyProvider({ children }: { children: React.ReactNode }) {
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([])
  const [currentEmergency, setCurrentEmergency] = useState<EmergencyRequest | null>(null)

  const createEmergencyRequest = (pet: Pet, clientId: string, clientName: string): string => {
    const newRequest: EmergencyRequest = {
      id: Date.now().toString(),
      clientId,
      clientName,
      pet,
      status: 'pending',
      createdAt: new Date(),
      messages: []
    }

    setEmergencyRequests(prev => [...prev, newRequest])
    return newRequest.id
  }

  const acceptEmergencyRequest = (requestId: string, veterinarianId: string, veterinarianName: string) => {
    setEmergencyRequests(prev => prev.map(req =>
      req.id === requestId
        ? { ...req, status: 'accepted', veterinarianId, veterinarianName }
        : req
    ))
  }

  const rejectEmergencyRequest = (requestId: string) => {
    setEmergencyRequests(prev => prev.map(req =>
      req.id === requestId
        ? { ...req, status: 'rejected' }
        : req
    ))
  }

  const sendMessage = (requestId: string, senderId: string, senderName: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId,
      senderName,
      content,
      timestamp: new Date()
    }

    setEmergencyRequests(prev => prev.map(req =>
      req.id === requestId
        ? { ...req, messages: [...req.messages, newMessage] }
        : req
    ))

    if (currentEmergency?.id === requestId) {
      setCurrentEmergency(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null)
    }
  }

  return (
    <EmergencyContext.Provider value={{
      emergencyRequests,
      currentEmergency,
      createEmergencyRequest,
      acceptEmergencyRequest,
      rejectEmergencyRequest,
      sendMessage,
      setCurrentEmergency
    }}>
      {children}
    </EmergencyContext.Provider>
  )
}

export function useEmergency() {
  const context = useContext(EmergencyContext)
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider')
  }
  return context
}
