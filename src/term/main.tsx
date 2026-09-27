import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './term.css'
import TermApp from './TermApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TermApp />
  </StrictMode>,
)
