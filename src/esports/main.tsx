import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './esports.css'
import EsportsApp from './EsportsApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EsportsApp />
  </StrictMode>,
)
