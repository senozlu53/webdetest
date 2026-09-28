import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './kawaii.css'
import KawaiiApp from './KawaiiApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KawaiiApp />
  </StrictMode>,
)
