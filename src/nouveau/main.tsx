import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './nouveau.css'
import NouveauApp from './NouveauApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NouveauApp />
  </StrictMode>,
)
