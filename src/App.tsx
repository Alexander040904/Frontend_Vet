import { useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage from './components/LadingPage'
import Login from './components/auth/Login'

function AppContent() {
    const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register'>('landing')

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
    default:
      return <LandingPage onGetStarted={() => setCurrentView('login')} />
  }
  
}

export default function App() {
  return (
    <AuthProvider>
      
        <AppContent />
      
    </AuthProvider>
  )
}

