import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import bozukCss from './anti.css?raw'
import { stilleriUygula } from './lib/ayar'
import AntiApp from './AntiApp'

// Madde 15: bozuk stil dosyası derleyiciden geçmeden, yazıldığı gibi sayfaya girer
const stil = document.createElement('style')
stil.id = 'bozuk-css'
stil.textContent = bozukCss
document.head.append(stil)

// HTML 3.2 renk öznitelikleri (tokenların kendisi): CSS kapalıyken de linkler #0000FF, ziyaret edilenler #800080
document.documentElement.lang = 'tr'
document.body.setAttribute('link', '#0000FF')
document.body.setAttribute('vlink', '#800080')
document.body.setAttribute('alink', '#FF0000')
if (document.documentElement.dataset.css === 'kapali') stilleriUygula(false)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AntiApp />
  </StrictMode>,
)
