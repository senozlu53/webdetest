import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fantasy.css'
import FantasyApp from './FantasyApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FantasyApp />
  </StrictMode>,
)
