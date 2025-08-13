import { format } from 'date-fns'
import { useState } from 'react'
import { useUIStore } from '../shared/store'
import { EventModal } from './EventModal'

const hours = Array.from({ length: 24 }).map((_, i) => i)

export function CenterScheduler() {
  const date = useUIStore((s) => s.selectedDate)
  const [openSlot, setOpenSlot] = useState<number | null>(null)

  return (
    <div className="h-full">
      <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur border-b px-4 py-3">
        <div className="text-sm text-gray-500">{format(new Date(date), 'yyyy年M月d日 (E)')}</div>
      </div>
      <div className="px-4 py-2 grid grid-cols-[64px_1fr] gap-2">
        <div className="space-y-8 text-xs text-gray-400">
          {hours.map((h) => (
            <div key={h} className="h-16">{h.toString().padStart(2, '0')}:00</div>
          ))}
        </div>
        <div className="relative">
          {hours.map((h) => (
            <div key={h} className="h-16 border-b border-dashed" onClick={() => setOpenSlot(h)} />
          ))}
        </div>
      </div>
      <EventModal open={openSlot !== null} hour={openSlot ?? 0} onClose={() => setOpenSlot(null)} />
    </div>
  )
}


