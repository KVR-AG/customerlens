import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'

export function AppLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <TopNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet context={{}} />
      </div>
    </div>
  )
}
