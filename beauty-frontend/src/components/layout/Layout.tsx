// Path: frontend/src/components/layout/Layout.tsx
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-gray-900 transition-colors duration-300">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex flex-1 pt-16 relative">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out p-6 ${
            sidebarOpen ? 'mr-64' : 'mr-20'
          }`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6 min-h-[calc(100vh-8rem)] transition-colors duration-300">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}