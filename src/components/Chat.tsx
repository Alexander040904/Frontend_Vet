'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { ArrowLeft, PawPrint, Send } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { type Message } from '../types/Chat/Message'
import { useEmergency } from '../contexts/EmergencyContext'
import Echo from '@/lib/echo'




interface ChatProps {
  onBack: () => void
}

export default function Chat({ onBack }: ChatProps) {
  const [message, setMessage] = useState('')
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60) // 24 horas en segundos
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { user } = useAuth()
  const { currentEmergency, sendMessage, messages } = useEmergency();

  //Realizamo un estado para almacenar los mensajes nuevos del chat temporalmente
  const [userChat, setUserChat] = useState<Message[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    console.log("📡 Suscribiéndose al canal chat.admin...");
    if (!currentEmergency?.chat_id) return;
    const channel = Echo.private(`chat.${currentEmergency?.chat_id}`)
      .listen('.MessageSent', (event: any) => {
        console.log("📩 New message received:", event);
        setUserChat((prev) => [...prev, event]);
      });

    return () => {
      console.log("❌ Desuscribiéndose del canal chat.admin");
      channel.stopListening('.MessageSent');
    };
  }, [currentEmergency?.chat_id]);




  // Traemos los mensajes 
  const fetchMessages = useCallback(async () => {
    try {
      if (currentEmergency && typeof currentEmergency.chat_id === 'number') {
        const msgs = await messages(currentEmergency.chat_id);
        setUserChat(msgs);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [currentEmergency, messages])


  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, currentEmergency]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [userChat]);



  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && currentEmergency && user) {
      let newMessage: Partial<Message> = {
        private_chat_id: currentEmergency.chat_id!,
        sender_id: parseInt(user.id!),
        message: message.trim(),
      }
      sendMessage(newMessage).then(() => {

        setMessage('');
      }).catch((err) => {
        console.error("Error sending message:", err);
      });

    }
  }





  if (!currentEmergency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="text-center p-8">
            <p>No hay chat activo</p>
            <Button onClick={onBack} className="mt-4">Volver</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button variant="ghost" onClick={onBack} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg shadow-lg">
                    <PawPrint className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      VetEmergency
                    </h1>
                    <p className="text-sm text-gray-500">
                      {user?.role_id === '2'
                        ? `Chat Con Dr. ${currentEmergency.vet_name}`
                        : `Chat Con ${currentEmergency.client_name}`
                      }
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
          {/* Información del caso */}
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-medium mb-2">Información del Caso</h3>
            <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
              <p><strong>Mascota:</strong> {currentEmergency.species} - {currentEmergency.breed}</p>
              <p><strong>Peso:</strong> {currentEmergency.weight} kg</p>
              <p><strong>Síntomas:</strong> {currentEmergency.symptoms}</p>
              <p className="col-span-2"><strong>Descripción:</strong> {currentEmergency.description}</p>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {userChat.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === Number(user?.id) ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender_id === Number(user?.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                      }`}
                  >
                    {/* <p className="text-sm font-medium mb-1">{msg.senderName}</p> */}
                    <p>{msg.message}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input de mensaje */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1"
                disabled={timeLeft === 0}
              />
              <Button type="submit" disabled={!message.trim() || timeLeft === 0}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            {timeLeft === 0 && (
              <p className="text-red-500 text-sm mt-2">El tiempo de chat ha expirado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
