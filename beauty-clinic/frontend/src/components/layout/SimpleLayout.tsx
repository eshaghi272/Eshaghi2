// Path: frontend/src/components/layout/SimpleLayout.tsx
import { Outlet } from 'react-router-dom'

export default function SimpleLayout() {
  console.log('✅ SimpleLayout is rendering')
  
  return (
    <div style={{ 
      background: '#f0f0f0', 
      minHeight: '100vh', 
      padding: '20px',
      paddingTop: '80px'
    }}>
      <div style={{ 
        background: '#C9A96E', 
        color: 'white', 
        padding: '15px 20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        🧪 این یک Layout ساده برای تست است
        <span style={{ marginRight: '20px', fontSize: '14px', fontWeight: 'normal' }}>
          (اگر این را می‌بینید، Layout درست کار می‌کند)
        </span>
      </div>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        minHeight: '400px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Outlet />
      </div>
    </div>
  )
}