import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './paper.css'
import PaperApp from './PaperApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PaperApp />
  </StrictMode>,
)
