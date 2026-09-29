import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './wabi.css'
import WabiApp from './WabiApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WabiApp />
  </StrictMode>,
)
