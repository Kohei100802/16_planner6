import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth } from 'date-fns'
import { useUIStore } from '../shared/store'

type Props = { collapsed: boolean; onToggle: () => void }

export function CalendarLeft({ collapsed, onToggle }: Props) {
  const selectedDate = useUIStore((s) => s.selectedDate)
  const setSelectedDate = useUIStore((s) => s.setSelectedDate)

  const base = new Date(selectedDate)
  const start = startOfMonth(base)
  const end = endOfMonth(base)
  const days = eachDayOfInterval({ start, end })

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <button className="text-gray-600" onClick={onToggle}>{collapsed ? '→' : '←'}</button>
        {!collapsed && <div className="font-semibold">{format(base, 'yyyy年M月')}</div>}
        <div className="space-x-1">
          <button className="px-2" onClick={() => setSelectedDate(format(addMonths(base, -1), 'yyyy-MM-dd'))}>‹</button>
          <button className="px-2" onClick={() => setSelectedDate(format(addMonths(base, 1), 'yyyy-MM-dd'))}>›</button>
        </div>
      </div>
      {!collapsed && (
        <div className="p-3 grid grid-cols-7 gap-1">
          {days.map((d) => {
            const iso = format(d, 'yyyy-MM-dd')
            const active = isSameDay(new Date(selectedDate), d)
            return (
              <button key={iso} onClick={() => setSelectedDate(iso)} className={`aspect-square rounded text-sm ${active ? 'bg-brand-600 text-white' : 'hover:bg-gray-100'}`}>
                {format(d, 'd')}
              </button>
            )
          })}
        </div>
      )}

      {!collapsed && (
        <div className="mt-auto p-3 text-xs text-gray-500">
          <div className="font-semibold mb-2">カレンダー</div>
          <ul className="space-y-1">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"/> 仕事</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"/> プライベート</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"/> 共通</li>
          </ul>
        </div>
      )}
    </div>
  )
}


