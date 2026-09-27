import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './ambient.css'
import AmbientApp from './AmbientApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AmbientApp />
  </StrictMode>,
)
