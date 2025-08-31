"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, LogOut, PawPrint, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface ProfileProps {
  onBack: () => void;
}

export default function Profile({ onBack }: ProfileProps) {
  const { user, updateProfile, deleteProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  const [error, setError] = useState("");
  const [correct, setCorrect] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    interface ProfilePayload {
      name: string;
      email: string;
      password?: string; // password opcional
    }
    const payload: ProfilePayload = {
      name: formData.name,
      email: formData.email,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    const response = await updateProfile(payload);
    if (!response.status) {
      setError(response.message || "Error al actualizar el perfil");
      setCorrect("");
    } else {
      setCorrect(response.message || "Perfil actualizado correctamente");
      setError("");
    }
  };

  // Manejar la eliminación del perfil
  const handleDelete = () => {
    deleteProfile();
  };
  // Manejar la salida de la cuenta
  const handleExit = () => {
    logout();
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg shadow-lg">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  VetEmergency
                </h1>
                <p className="text-sm text-red-800">Mi Perfil</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Actualiza tu información personal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Dejar en blanco si no deseas cambiar"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
              {correct && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                  {correct}
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full">
                Actualizar Perfil
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-red-600">Cerrar Sesión</CardTitle>
            <CardDescription>
              Te desconectará de tu cuenta en este dispositivo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showExitConfirm ? (
              <Button
                variant="secondary"
                onClick={() => setShowExitConfirm(true)}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir de la Cuenta
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-red-600 font-medium">
                  ¿Estás seguro de que quieres salir?
                </p>
                <div className="flex space-x-2">
                  <Button variant="destructive" onClick={handleExit}>
                    Sí, deseo salir
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowExitConfirm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-red-600">Zona Peligrosa</CardTitle>
            <CardDescription>
              Eliminar tu cuenta es una acción irreversible
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Cuenta
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-red-600 font-medium">
                  ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción
                  no se puede deshacer.
                </p>
                <div className="flex space-x-2">
                  <Button variant="destructive" onClick={handleDelete}>
                    Sí, eliminar mi cuenta
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
