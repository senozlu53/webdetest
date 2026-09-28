import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './win.css'
import { imlecURL } from './lib/pixel'
import WinApp from './WinApp'

// Madde 16: yükleme sırasında piksel kum saati imleci
document.documentElement.style.setProperty('--kum', imlecURL('kumsaati'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WinApp />
  </StrictMode>,
)
