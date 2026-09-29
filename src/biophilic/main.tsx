import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './biophilic.css'
import BiophilicApp from './BiophilicApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BiophilicApp />
  </StrictMode>,
)
