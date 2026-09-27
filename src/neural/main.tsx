import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './neural.css'
import NeuralApp from './NeuralApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NeuralApp />
  </StrictMode>,
)
