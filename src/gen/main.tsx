import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './gen.css'
import GenApp from './GenApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GenApp />
  </StrictMode>,
)
