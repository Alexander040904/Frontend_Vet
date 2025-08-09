"use client";

import axios from "axios";
import React, { createContext, useContext, useState,useEffect } from "react";

export type UserRole = "1" | "2";

export interface User {
  id: string
  name: string;
  email: string;
  role_id: UserRole;
  password?: string;
  password_confirmation?: string;
 
}

interface AuthResponse {
  status: boolean;
  message: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (
    userData: Partial<User> 
  ) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  deleteProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


  

// Datos simulados de usuarios
const mockUsers: (User)[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@cliente.com",
    role_id: "2",
    password: "123456",
  
   
  },
  {
    id: "2",
    name: "Dr. María García",
    email: "maria@vet.com",
    password: "123456",
    role_id: "2",

  },
  {
    id: "3",
    name: "Dr. Carlos López",
    email: "carlos@vet.com",
    password: "123456",
    role_id: "1",

  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])


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
      setUser(response.data.user);
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
    userData: Partial<User> 
  ): Promise<AuthResponse> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Registration successful:", response.data.data);
      setUser(response.data.data);

      // Guardar el usuario registrado
      localStorage.setItem("auth_token", response.data.token.plainTextToken);
      localStorage.setItem("user", JSON.stringify(response.data.data));

      console.log("Toke: ", localStorage.getItem("auth_token"));

      return {
        status: true,
        message: response.data.message,
      };
      



    }catch (err: unknown) {
      let errorMessage = "Error al registrarse";

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

  const logout = async() => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      console.log("Logout successful:", response.data);
      localStorage.removeItem("auth_token");
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
    }
    
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
