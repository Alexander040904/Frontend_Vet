"use client";

import axios from "axios";
import React, { createContext, useContext, useState } from "react";

export type UserRole = "client" | "veterinarian";

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  role: UserRole;
  specialization?: string;
  isAvailable?: boolean;
}

interface AuthResponse {
  status: boolean;
  message: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (
    userData: Partial<User> & { password: string }
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  deleteProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Datos simulados de usuarios
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@cliente.com",
    password: "123456",
    age: 30,
    role: "client",
  },
  {
    id: "2",
    name: "Dr. María García",
    email: "maria@vet.com",
    password: "123456",
    role: "veterinarian",
    specialization: "Medicina General",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Dr. Carlos López",
    email: "carlos@vet.com",
    password: "123456",
    role: "veterinarian",
    specialization: "Cirugía",
    isAvailable: false,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login successful:", response.data);

      // Si quieres guardar el token
      const token = response.data.token;
      localStorage.setItem("auth_token", token);

      // Si también quieres guardar datos del usuario
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return {
        status: true,
        message: response.data.message,
      };
    } catch (err: unknown) {
      let errorMessage = "Error al iniciar sesión";

      if (axios.isAxiosError(err)) {
        // Si la API devuelve un mensaje en la respuesta, lo usamos
        errorMessage =
          (err.response?.data as { message?: string })?.message ||
          err.message ||
          errorMessage;

        console.error("Login failed:", err.response?.data || err.message);
      } else {
        console.error("Unexpected error:", err);
      }

      return {
        status: false,
        message: errorMessage,
      };
    }
  };

  const register = async (
    userData: Partial<User> & { password: string }
  ): Promise<boolean> => {
    const existingUser = mockUsers.find((u) => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name || "",
      email: userData.email || "",
      age: userData.age,
      role: userData.role || "client",
      password: userData.password,
    };

    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const deleteProfile = () => {
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        deleteProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
