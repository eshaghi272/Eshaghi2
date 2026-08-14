// Path: frontend/src/components/layout/PublicLayout.tsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function PublicLayout() {
  const fakeSetSidebarOpen = () => {}
  
  console.log('PublicLayout is rendering') // <- برای تست

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-gray-900 transition-colors duration-300">
      <Header sidebarOpen={false} setSidebarOpen={fakeSetSidebarOpen} />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}