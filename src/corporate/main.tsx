import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './corporate.css'
import CorporateApp from './CorporateApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CorporateApp />
  </StrictMode>,
)
