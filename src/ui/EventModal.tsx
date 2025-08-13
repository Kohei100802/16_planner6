import { useState } from 'react'
import { format, setHours, setMinutes } from 'date-fns'
import { db } from '../shared/db'
import { useUIStore } from '../shared/store'

type Props = { open: boolean; hour: number; onClose: () => void }

export function EventModal({ open, hour, onClose }: Props) {
  const date = useUIStore((s) => s.selectedDate)
  const [title, setTitle] = useState('')
  const [allDay, setAllDay] = useState(false)
  const [calendarId, setCalendarId] = useState('work')
  const [duration, setDuration] = useState(60)

  if (!open) return null

  const save = async () => {
    const base = new Date(date)
    const start = setMinutes(setHours(base, hour), 0)
    const end = setMinutes(setHours(base, hour), duration)
    await db.events.put({
      id: crypto.randomUUID(),
      userId: 'local',
      calendarId,
      title: title || '無題',
      start: format(start, "yyyy-MM-dd'T'HH:mm"),
      end: allDay ? undefined : format(end, "yyyy-MM-dd'T'HH:mm"),
      allDay,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/20" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[560px] p-4" onClick={(e) => e.stopPropagation()}>
        <div className="text-lg font-semibold mb-3">予定を追加</div>
        <div className="space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="名称" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="flex gap-2 items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
              終日
            </label>
            <select className="border rounded px-2 py-1" value={calendarId} onChange={(e) => setCalendarId(e.target.value)}>
              <option value="work">仕事</option>
              <option value="private">プライベート</option>
              <option value="shared">共通</option>
            </select>
            {!allDay && (
              <select className="border rounded px-2 py-1" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                <option value={30}>30分</option>
                <option value={60}>1時間</option>
                <option value={90}>1.5時間</option>
                <option value={120}>2時間</option>
              </select>
            )}
          </div>
          <div className="text-sm text-gray-500">{format(new Date(date), 'yyyy年M月d日')} {hour.toString().padStart(2, '0')}:00 から</div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-2" onClick={onClose}>キャンセル</button>
          <button className="px-3 py-2 bg-brand-600 text-white rounded" onClick={save}>保存</button>
        </div>
      </div>
    </div>
  )
}


