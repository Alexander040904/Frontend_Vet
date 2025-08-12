import { useState } from "react";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { EmergencyProvider } from "./contexts/EmergencyContext";
import ClientDashboard from "./components/dashboard/ClientDashboard";
import LandingPage from "./components/LadingPage";

import VeterinarianDashboard from "./components/dashboard/VeterinarianDashboard";
function AppContent() {
  const [currentView, setCurrentView] = useState<
    "landing" | "login" | "register" | "dashboard"
  >("landing");

  const { user, loading } = useAuth();


  console.log("token: ", localStorage.getItem("auth_token"));
  console.log("user: ", user);


  if (loading) {
    console.log("Loading user data...");

    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (user && localStorage.getItem("auth_token")) {
    console.log("User is logged in:", user.role_id);

    return user.role_id === '2' ? <ClientDashboard />
      : <VeterinarianDashboard /> // Aquí deberías tener un componente para el dashboard del veterinario>
  }

  switch (currentView) {
    case "landing":
      return <LandingPage onGetStarted={() => setCurrentView("login")} />;
    case "login":
      return (
        <Login
          onSwitchToRegister={() => setCurrentView("register")}
          onBack={() => setCurrentView("landing")}
        />
      );
    case "register":
      return (
        <Register
          onSwitchToLogin={() => setCurrentView("login")}
          onBack={() => setCurrentView("landing")}
        />
      );
    default:
      return <LandingPage onGetStarted={() => setCurrentView("login")} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <EmergencyProvider>
        <AppContent />
      </EmergencyProvider>
    </AuthProvider>
  );
}
