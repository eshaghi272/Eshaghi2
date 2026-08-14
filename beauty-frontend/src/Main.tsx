// Path: frontend/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import { API_URL } from './config/api'
import App from './App.tsx'
import './index.css'
axios.defaults.baseURL = API_URL

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)