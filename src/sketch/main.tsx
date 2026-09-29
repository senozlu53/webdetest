import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './sketch.css'
import SketchApp from './SketchApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SketchApp />
  </StrictMode>,
)
