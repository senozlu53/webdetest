import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './gothic.css'
import GothicApp from './GothicApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GothicApp />
  </StrictMode>,
)
