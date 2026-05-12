import { Outlet } from 'react-router-dom'
import { SideNav } from './SideNav'

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
