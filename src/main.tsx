import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "@/components/ui/sonner"

import App from './App.tsx'
import './index.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
      position="top-right"   // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
      richColors             // habilita colores más vivos (usado con variant)
      toastOptions={{
        duration: 60000,      // duración en ms
        style: {
          minWidth: "300px",      // ancho mínimo
          maxWidth: "500px",      // ancho máximo
          minHeight: "80px",      // altura mínima
          maxHeight: "200px",     // altura máxima
          overflowY: "auto",      // si el contenido es muy largo, agrega scroll vertical

        },
      }}
    />

    <App />
  </StrictMode>,
)
