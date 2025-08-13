import { useState } from 'react'
import { CalendarLeft } from '../ui/CalendarLeft'
import { CenterScheduler } from '../ui/CenterScheduler'
import { RightPanel } from '../ui/RightPanel'

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="h-full w-full grid" style={{ gridTemplateColumns: collapsed ? '56px 1fr 360px' : '280px 1fr 360px' }}>
      <aside className="border-r panel-scroll no-scrollbar bg-white">
        <CalendarLeft collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      </aside>
      <main className="panel-scroll no-scrollbar bg-gray-50">
        <CenterScheduler />
      </main>
      <aside className="border-l panel-scroll no-scrollbar bg-white">
        <RightPanel />
      </aside>
    </div>
  )
}


