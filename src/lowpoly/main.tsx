import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lowpoly.css'
import LowPolyApp from './LowPolyApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LowPolyApp />
  </StrictMode>,
)
