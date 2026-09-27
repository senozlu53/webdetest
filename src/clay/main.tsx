import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './clay.css'
import ClayApp from './ClayApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClayApp />
  </StrictMode>,
)
