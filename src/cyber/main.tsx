import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './cyber.css'
import CyberApp from './CyberApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CyberApp />
  </StrictMode>,
)
