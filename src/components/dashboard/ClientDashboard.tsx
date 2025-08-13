"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../ui/card";
import { Badge } from "../ui/badge";
import { AlertTriangle, MessageCircle, Clock, User, CheckCircle, XCircle, PawPrint, } from "lucide-react";
import { useAuth, type User as Vet } from "../../contexts/AuthContext";
import { useEmergency, type EmergencyRequest, } from "../../contexts/EmergencyContext2";
import EmergencyForm from "../EmergencyForm";
import Chat from "../Chat";
import Profile from "../Profile";

export default function ClientDashboard() {
  const [activeView, setActiveView] = useState<
    "dashboard" | "emergency" | "chat" | "profile"
  >("dashboard");
  const { user } = useAuth();
  const { emergencyRequests, currentEmergency, setCurrentEmergency } =
    useEmergency();

  const [userRequests, setUserRequests] = useState<EmergencyRequest[]>([]);
  const [activeRequest, setActiveRequest] = useState<EmergencyRequest | undefined>();


  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await emergencyRequests();
        setUserRequests(requests);

        const acceptedRequest = requests.find((req) => req.status === "accepted");
        setActiveRequest(acceptedRequest);

      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleEmergencyClick = () => {
    setActiveView("emergency");
  };

  const handleChatClick = (emergency: any) => {
    setCurrentEmergency(emergency);
    setActiveView("chat");
  };

  if (activeView === "emergency") {
    return <EmergencyForm onBack={() => setActiveView("dashboard")} />;
  }

  if (activeView === "chat" && currentEmergency) {
    return <Chat onBack={() => setActiveView("dashboard")} />;
  }

  if (activeView === "profile") {
    return <Profile onBack={() => setActiveView("dashboard")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
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
                <p className="text-sm text-gray-500">Panel del Cliente</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-500">Bienvenido,</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emergency Button - Full Width */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-red-500 to-red-600 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <CardHeader className="text-center relative z-10 pb-4">
                <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <AlertTriangle className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold mb-2">
                  ¿Tu mascota necesita ayuda urgente?
                </CardTitle>
                <CardDescription className="text-red-100 text-lg">
                  Conecta con un veterinario certificado en menos de 5 minutos
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <Button
                  size="lg"
                  className="bg-white text-red-600 hover:bg-red-50 px-12 py-6 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={handleEmergencyClick}
                >
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  SOLICITAR EMERGENCIA
                </Button>
                <p className="text-red-100 text-sm mt-4">
                  Servicio disponible 24/7 • Respuesta garantizada
                </p>
              </CardContent>
            </Card>
          </div>

          {/* My Requests */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <Clock className="h-6 w-6 mr-2 text-blue-600" />
                      Mis Solicitudes
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Historial y estado de tus emergencias
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {userRequests.length} Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {userRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">
                      No tienes solicitudes
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Tus emergencias aparecerán aquí
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-130 overflow-y-auto pr-2">
                    {userRequests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {request.species} - {request.breed}
                            </h3>

                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge
                              variant={
                                request.status === "pending"
                                  ? "secondary"
                                  : request.status === "accepted"
                                    ? "default"
                                    : request.status === "rejected"
                                      ? "destructive"
                                      : "outline"
                              }
                              className="flex items-center space-x-1"
                            >
                              {request.status === "pending" && (
                                <Clock className="h-3 w-3" />
                              )}
                              {request.status === "accepted" && (
                                <CheckCircle className="h-3 w-3" />
                              )}
                              {request.status === "rejected" && (
                                <XCircle className="h-3 w-3" />
                              )}
                              <span>
                                {request.status === "pending"
                                  ? "Pendiente"
                                  : request.status === "accepted"
                                    ? "Aceptada"
                                    : request.status === "rejected"
                                      ? "Rechazada"
                                      : "Completada"}
                              </span>
                            </Badge>
                            {request.status === "accepted" && (
                              <Button
                                size="sm"
                                onClick={() => handleChatClick(request)}
                                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Chat
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                          <p>
                            <strong>Síntomas:</strong> {request.symptoms}
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {request.created_at
                                ? new Date(
                                  request.created_at
                                ).toLocaleDateString()
                                : "Fecha no disponible"}{" "}
                              a las{" "}
                              {request.created_at
                                ? new Date(
                                  request.created_at
                                ).toLocaleTimeString()
                                : "Hora no disponible"}
                            </p>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Chat */}
          <div className="lg:col-span-1">
            {activeRequest ? (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="pb-4">
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">
                    Chat Activo
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Conectado con Dr. {(activeRequest?.vet_name) || "Veterinario"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-sm font-medium">Caso:</p>
                      <p className="text-green-100">
                        {activeRequest.species} - {activeRequest.breed}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-white text-green-600 hover:bg-green-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => handleChatClick(activeRequest)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Abrir Chat
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Sin Chat Activo
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    No tienes conversaciones activas en este momento
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-500">
                    Cuando un veterinario acepte tu solicitud, podrás chatear
                    aquí
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
