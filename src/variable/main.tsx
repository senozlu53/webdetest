import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './variable.css'
import VariableApp from './VariableApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VariableApp />
  </StrictMode>,
)
