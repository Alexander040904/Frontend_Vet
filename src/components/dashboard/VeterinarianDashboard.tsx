'use client'

import { useEffect, useState } from 'react'

import { toast } from "sonner"
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { MessageCircle, User, LogOut, Check, X, Bell, PawPrint } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

import { useEmergency } from '../../contexts/EmergencyContext'

import Chat from '../Chat'
import Profile from '../Profile'
import Echo from '../../lib/echo';

export default function VeterinarianDashboard() {




    const [activeView, setActiveView] = useState<'dashboard' | 'chat' | 'profile'>('dashboard')


    /*     const { emergencyRequests, acceptEmergencyRequest, rejectEmergencyRequest, setCurrentEmergency } = useEmergency() */
    const { user } = useAuth()

    const { showNotifications, emergencyRequests, aceptEmergencyRequest, readNotification, setCurrentEmergency } = useEmergency()

    const [notifications, setNotifications] = useState<any[]>([]);
    const [currentEmergencys, setCurrentEmergencys] = useState<any[]>([]);

    const fetchNotifications = async () => {
        try {
            const responseNotifications = await showNotifications();
            const responseEmergencies = await emergencyRequests();

            setCurrentEmergencys(responseEmergencies);
            console.log("📬 Notificaciones recibidas:", responseNotifications);

            setNotifications(responseNotifications);
            console.log("📬 Emergencias recibidas:", responseEmergencies);

        } catch (error) {
            console.error("Error fetching notifications or emergencies:", error);
        }
    };

    useEffect(() => {
        if (!user) return;
        console.log("📡 Suscribiéndose al canal emergencies.admin...");

        const channel = Echo.private(`emergencies.admin.${user.id}`)
            .listen(".EmergencyNotification", (event: any) => {


                if (event.id !== localStorage.getItem("last_notification_id")) {
                    console.log("🚨 Notificación de emergencia recibida:", event);


                    toast.success("Nueva emergencia", {
                        description: <span className="text-sm md:text-base">{event.message}</span>,

                        action: {
                            label: "Ver",
                            onClick: () => setActiveView('dashboard'),
                        },
                    })

                    localStorage.setItem("last_notification_id", event.id);

                    fetchNotifications();
                }

            });

        // Cleanup al desmontar el componente
        return () => {
            console.log("❌ Desuscribiéndose del canal emergencies.admin");
            channel.stopListening(".EmergencyNotification");
            Echo.leave(`emergencies.admin.${user.id}`);
        };
    }, []);



    useEffect(() => {

        fetchNotifications();

    }, []);


    const handleAcceptRequest = async (requestId: string, notificationId: string) => {
        try {
            const response = await aceptEmergencyRequest(Number(requestId));
            console.log("✅ Solicitud aceptada:", response);
            // 2️⃣ Marcar notificación como leída
            await readNotification(notificationId);
            console.log("✅ Notificación leída");

            // 3️⃣ Refrescar datos para que el componente se renderice con información actualizada
            const [updatedNotifications, updatedEmergencies] = await Promise.all([
                showNotifications(),
                emergencyRequests(),
            ]);

            setNotifications(updatedNotifications);
            setCurrentEmergencys(updatedEmergencies);
            console.log("📬 Datos actualizados tras aceptar emergencia");


        } catch (error) {
            console.error("Error al aceptar la solicitud:", error);

        }

    }

    const handleRejectRequest = async (notificationId: string) => {
        try {

            await readNotification(notificationId);
            console.log("✅ Notificación leída");

            const responseNotifications = await showNotifications();
            setNotifications(responseNotifications);
        } catch (error) {
            console.error("Error al rechazar la solicitud:", error);
        }
    }

    const handleChatClick = (emergency: any) => {
        setCurrentEmergency(emergency)
        console.log("Setting current emergency:", emergency);

        setActiveView('chat')
    }

    if (activeView === 'chat') {
        return <Chat onBack={() => setActiveView('dashboard')} />
    }

    if (activeView === 'profile') {
        return <Profile onBack={() => setActiveView('dashboard')} />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg shadow-lg">
                                <PawPrint className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                                    VetEmergency
                                </h1>
                                <p className="text-sm text-gray-500">Panel del Veterinario</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-gray-500">Bienvenido, Doc</p>
                                <p className="font-semibold text-gray-900">{user?.name}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveView("profile")}
                                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                                <User className="h-4 w-4 mr-2" />
                                Perfil
                            </Button>
                        </div>
                    </div>
                </div>
            </header>


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Solicitudes Pendientes */}
                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                                        <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-lg mr-3">
                                            <Bell className="h-5 w-5 text-white" />
                                        </div>
                                        Emergencias Pendientes
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 mt-1">
                                        Casos que requieren atención inmediata
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    {notifications.length} Urgentes
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {notifications.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Bell className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-lg font-medium">No hay emergencias pendientes</p>
                                    <p className="text-gray-400 text-sm mt-1">Las nuevas solicitudes aparecerán aquí</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-130 overflow-y-auto pr-2">
                                    {notifications.map((request) => (
                                        <div
                                            key={request.id}
                                            className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-lg flex items-center">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                                                        Paciente: {request.data.species} - {request.data.breed}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(request.created_at).toLocaleDateString('es-ES')}
                                                    </p>
                                                </div>
                                                <Badge className="bg-red-500 hover:bg-red-500 text-white">URGENTE</Badge>
                                            </div>

                                            <div className="space-y-2 mb-4 bg-white/50 rounded-lg p-3">

                                                <p>
                                                    <strong>Peso:</strong> {request.data.weight} kg
                                                </p>
                                                <p>
                                                    <strong>Síntomas:</strong> {request.data.symptoms}
                                                </p>
                                                <p>
                                                    <strong>Descripción:</strong> {request.data.description}
                                                </p>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAcceptRequest(request.data.id, request.id)}
                                                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                                >
                                                    <Check className="h-4 w-4 mr-1" />
                                                    Aceptar Caso
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRejectRequest(request.id)}
                                                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Rechazar
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Mis Casos Activos */}
                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg mr-3">
                                            <MessageCircle className="h-5 w-5 text-white" />
                                        </div>
                                        Mis Casos Activos
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 mt-1">
                                        Casos que estás atendiendo actualmente
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {currentEmergencys.length} Activos
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {currentEmergencys.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageCircle className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-lg font-medium">No tienes casos activos</p>
                                    <p className="text-gray-400 text-sm mt-1">Los casos aceptados aparecerán aquí</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-130 overflow-y-auto pr-2">
                                    {currentEmergencys.map((request) => (
                                        <div
                                            key={request.id}
                                            className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-lg flex items-center">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                                        {request.client_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {request.species} - {request.breed}
                                                    </p>
                                                </div>
                                                <Badge className="bg-green-500 hover:bg-green-500 text-white">EN CURSO</Badge>
                                            </div>

                                            <div className="mb-4 bg-white/50 rounded-lg p-3">
                                                <p className="text-sm text-gray-600">
                                                    <strong>Síntomas:</strong> {request.symptoms}
                                                </p>
                                            </div>

                                            <Button
                                                size="sm"
                                                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                                onClick={() => handleChatClick(request)}
                                            >
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                Abrir Chat
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
