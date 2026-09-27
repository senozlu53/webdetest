import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './swiss.css'
import App from './SwissApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
