import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './routes/AppRouter'
import { CartProvider } from './contexts/CartContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <AppRouter />
    </CartProvider>
  </React.StrictMode>
)