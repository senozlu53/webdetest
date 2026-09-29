import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './deco.css'
import DecoApp from './DecoApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DecoApp />
  </StrictMode>,
)
