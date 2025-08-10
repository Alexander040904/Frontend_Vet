"use client";

import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "1" | "2";

// Definimos la interfaz del usuario
export interface User {
  id?: string;
  name: string;
  email: string;
  role_id?: UserRole;
  password?: string;
  password_confirmation?: string;
}

interface AuthResponse {
  status: boolean;
  message: string;
}
// Definimos el contexto y su tipo
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: Partial<User>) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<AuthResponse>;
  deleteProfile: () => void;
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);



// Proveedor del contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos la carga, puede ser llamada API o leer localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Forzar que role_id siempre sea string
      parsedUser.role_id = String(parsedUser.role_id) as UserRole;

      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

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

  const register = async (userData: Partial<User>): Promise<AuthResponse> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        userData,
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
    } catch (err: unknown) {
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

  const logout = async () => {
    try {
      console.log("token: ", localStorage.getItem("auth_token"));

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
      localStorage.removeItem("user");
      setUser(null);
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

  const updateProfile = async (userData: Partial<User>):Promise<AuthResponse> => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/profile`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      console.log("Profile updated successfully:", response.data.data);
      
      localStorage.setItem("user", JSON.stringify(response.data.data));
      return {
        status: true,
        message: response.data.message,
      };
    } catch (error: unknown) {
      let errorMessage = "Error al actualizar el perfil";
      if (axios.isAxiosError(error)) {
        errorMessage =
          (error.response?.data as { message?: string })?.message ||
          error.message ||
          errorMessage;
        console.error(
          "Profile update failed:",
          error.response?.data || error.message
        );
        
      } else {
        console.error("Unexpected error:", error);
      }
      return {
        status: false,
        message: errorMessage,
      };
    
  };
}

const deleteProfile = async (): Promise<AuthResponse> => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });

    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);

    return {
      status: true,
      message: "Perfil eliminado correctamente",
    };
  } catch (error: unknown) {
    console.error("Error deleting profile:", error);

    let errorMessage = "Error al eliminar el perfil. Por favor, inténtalo de nuevo más tarde.";
    if (axios.isAxiosError(error)) {
      errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        errorMessage;
    }

    return {
      status: false,
      message: errorMessage,
    };
  }
};


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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

// Hook para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
