import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './iso.css'
import IsoApp from './IsoApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IsoApp />
  </StrictMode>,
)
