import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './holo.css'
import HoloApp from './HoloApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HoloApp />
  </StrictMode>,
)
