import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './quiet.css'
import QuietApp from './QuietApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QuietApp />
  </StrictMode>,
)
