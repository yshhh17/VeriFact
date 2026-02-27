import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import AuthTest from './pages/AuthTest.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthTest />
  </StrictMode>,
)
