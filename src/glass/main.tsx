import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './glass.css'
import GlassApp from './GlassApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlassApp />
  </StrictMode>,
)
