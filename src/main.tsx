import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' //目前的主要 css file
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
