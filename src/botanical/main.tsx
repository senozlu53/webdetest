import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './botanical.css'
import BotanicalApp from './BotanicalApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BotanicalApp />
  </StrictMode>,
)
