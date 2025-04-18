import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' //目前的主要 css file
import LoginPage from './LoginPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginPage />
  </StrictMode>,
)
