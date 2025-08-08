import { useState } from 'react'

import './App.css'
import LandingPage from './components/LadingPage'

function App() {
    const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register'>('landing')

  return <LandingPage onGetStarted={() => setCurrentView('login')} />
  
}

export default App
