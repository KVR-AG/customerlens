import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { SideNav } from './SideNav'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('cl.sidebar.collapsed')
    if (saved === '1') setCollapsed(true)
  }, [])

  const toggleSidebar = () => {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem('cl.sidebar.collapsed', next ? '1' : '0')
      return next
    })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav collapsed={collapsed} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
