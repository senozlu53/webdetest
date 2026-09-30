import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './editorial.css'
import EditorialApp from './EditorialApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EditorialApp />
  </StrictMode>,
)
