import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './arcade.css'
import ArcadeApp from './ArcadeApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArcadeApp />
  </StrictMode>,
)
