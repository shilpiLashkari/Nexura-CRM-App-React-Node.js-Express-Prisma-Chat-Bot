import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.tsx'

// Set Axios Base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Fallback for local dev if env not set

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
