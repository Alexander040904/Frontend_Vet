import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { EmergencyProvider } from "./contexts/EmergencyContext";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import LandingPage from "./components/LadingPage";
import ClientDashboard from "./components/dashboard/ClientDashboard";
import VeterinarianDashboard from "./components/dashboard/VeterinarianDashboard";

function AppContent() {
  const [currentView, setCurrentView] = useState<
    "landing" | "login" | "register"
  >("landing");

  const { user, loading } = useAuth();
  console.log("Current user in App.tsx:", user);

  // ⏳ Mientras carga el usuario, mostramos un spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando...
      </div>
    );
  } else if (user && localStorage.getItem("auth_token")) {
    return user.role_id === "2" ? <ClientDashboard /> : <VeterinarianDashboard />;
  }

  else {
    // Si no hay usuario, renderizamos las vistas de landing/login/register
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
