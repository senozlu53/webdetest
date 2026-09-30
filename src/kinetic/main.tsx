import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './kinetic.css'
import KineticApp from './KineticApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KineticApp />
  </StrictMode>,
)
