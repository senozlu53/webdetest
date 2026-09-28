import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './y2k.css'
import Y2KApp from './Y2KApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Y2KApp />
  </StrictMode>,
)
