import { useState } from 'react'


import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import { EmergencyProvider } from './contexts/EmergencyContext'
import ClientDashboard from './components/dashboard/ClientDashboard'
import LandingPage from './components/LadingPage'
function AppContent() {
    const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register'>('landing')
    
  const { user } = useAuth()

  // Si el usuario está autenticado, mostrar el dashboard correspondiente
  if (user) {
    return user.role_id=== '2' ? <ClientDashboard /> : "VeterinarianDashboard" // Aquí deberías tener un componente para el dashboard del veterinario>
  }

   switch (currentView) {
    case 'landing':
      return <LandingPage onGetStarted={() => setCurrentView('login')} />
    case 'login':
      return (
        <Login
          onSwitchToRegister={() => setCurrentView('register')}
          onBack={() => setCurrentView('landing')}
        />
      )
      case 'register':
      return (
        <Register
          onSwitchToLogin={() => setCurrentView('login')}
          onBack={() => setCurrentView('landing')}
        />
      )
    default:
      return <LandingPage onGetStarted={() => setCurrentView('login')} />
  }
  
}

export default function App() {
  return (
    <AuthProvider>

       <EmergencyProvider>
        <AppContent />
       </EmergencyProvider>
    </AuthProvider>
  )
}

