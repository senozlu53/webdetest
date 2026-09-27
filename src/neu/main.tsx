import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './neu.css'
import NeuApp from './NeuApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NeuApp />
  </StrictMode>,
)
