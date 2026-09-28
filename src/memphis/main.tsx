import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './memphis.css'
import MemphisApp from './MemphisApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MemphisApp />
  </StrictMode>,
)
