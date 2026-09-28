import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './synth.css'
import SynthApp from './SynthApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SynthApp />
  </StrictMode>,
)
