import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './soft.css'
import SoftApp from './SoftApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SoftApp />
  </StrictMode>,
)
