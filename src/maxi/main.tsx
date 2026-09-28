import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './maxi.css'
import MaxiApp from './MaxiApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MaxiApp />
  </StrictMode>,
)
