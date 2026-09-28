import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './brut.css'
import BrutApp from './BrutApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrutApp />
  </StrictMode>,
)
