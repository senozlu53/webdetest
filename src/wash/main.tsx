import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './wash.css'
import WashApp from './WashApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WashApp />
  </StrictMode>,
)
