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
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ArrowLeft, PawPrint } from "lucide-react";

import { useEmergency } from "../contexts/EmergencyContext2";

interface EmergencyFormProps {
  onBack: () => void;
}

export default function EmergencyForm({ onBack }: EmergencyFormProps) {
  const [formData, setFormData] = useState({
    species: "",
    weight: "",
    breed: "",
    symptoms: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { createEmergencyRequest } = useEmergency();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createEmergencyRequest({
        species: formData.species,
        weight: formData.weight,
        breed: formData.breed,
        symptoms: formData.symptoms,
        description: formData.description,
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error creating emergency request:", error);
      alert(
        "Error al enviar la solicitud. Por favor, inténtalo de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">
              ¡Solicitud Enviada!
            </CardTitle>
            <CardDescription>
              Tu solicitud de emergencia ha sido enviada a los veterinarios
              disponibles. Te notificaremos cuando un veterinario acepte tu
              caso.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={onBack}>Volver al Panel</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <p className="text-sm text-red-800">
                  Solicitud de Emergencia
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Información de tu Mascota</CardTitle>
            <CardDescription>
              Completa todos los campos para que el veterinario pueda ayudarte
              mejor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="species">Especie</Label>
                  <Select
                    value={formData.species}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, species: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona la especie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="perro">Perro</SelectItem>
                        <SelectItem value="gato">Gato</SelectItem>
                        <SelectItem value="ave">Ave</SelectItem>
                        <SelectItem value="conejo">Conejo</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        weight: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="breed">Raza</Label>
                <Input
                  id="breed"
                  value={formData.breed}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, breed: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Síntomas</Label>
                <Input
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      symptoms: e.target.value,
                    }))
                  }
                  placeholder="Ej: vómitos, diarrea, dificultad para respirar"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción Detallada</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe con detalle lo que está pasando con tu mascota..."
                  rows={4}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Solicitud de Emergencia"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
