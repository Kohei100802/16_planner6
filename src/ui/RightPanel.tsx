import { useEffect, useMemo, useState } from 'react'
import { useUIStore } from '../shared/store'
import { db, DayNote, Goal, Reminder } from '../shared/db'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Table } from 'dexie'
import { useAuth } from '../shared/auth'

type Item = Goal | Reminder

function Section<T extends Item>({ title, table, date }: { title: string; table: Table<T, string>; date: string }) {
  const [items, setItems] = useState<T[]>([])
  const { user } = useAuth()

  useEffect(() => {
    table
      .where({ date, userId: user?.uid ?? 'local' } as any)
      .sortBy('order')
      .then((rows) => setItems(rows as T[]))
  }, [date, table, user])

  const add = async () => {
    const id = crypto.randomUUID()
    await (table as any).put({ id, title: '', order: items.length, userId: user?.uid ?? 'local', date })
    const rows = await (table as any).where({ date, userId: user?.uid ?? 'local' }).sortBy('order')
    setItems(rows)
  }

  const update = async (id: string, patch: Partial<T>) => {
    await (table as any).update(id, patch)
    const rows = await (table as any).where({ date, userId: user?.uid ?? 'local' }).sortBy('order')
    setItems(rows)
  }

  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{title}</div>
        <button className="text-brand-600" onClick={add}>追加</button>
      </div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className="group flex items-center gap-2">
            <input className="flex-1 border rounded px-2 py-1" value={(it as any).title}
                   onChange={(e) => update(it.id, { title: e.target.value } as any)}
                   onKeyDown={async (e) => { if (e.key === 'Enter') add() }} />
            <button className="opacity-0 group-hover:opacity-100 text-gray-500">ⓘ</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function RightPanel() {
  const date = useUIStore((s) => s.selectedDate)
  const [note, setNote] = useState<DayNote | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const load = async () => {
      const existing = await db.dayNotes.get(date)
      if (existing) setNote(existing)
      else setNote({ id: date, markdown: '', userId: user?.uid ?? 'local', updatedAt: Date.now() })
    }
    load()
  }, [date, user])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!note) return
      db.dayNotes.put({ ...note, updatedAt: Date.now() })
    }, 500)
    return () => clearTimeout(handler)
  }, [note])

  const title = useMemo(() => `${format(new Date(date), 'yyyy年M月d日')}メモ`, [date])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">ポモドーロ</div>
        <Pomodoro />
      </div>

      <Section title="ゴール" table={db.goals as any} date={date} />
      <Section title="リマインダー" table={db.reminders as any} date={date} />

      <div className="border rounded-lg">
        <div className="px-3 py-2 border-b font-semibold">{title}</div>
        <div className="grid grid-cols-2">
          <textarea className="h-64 p-3 outline-none resize-none"
                    placeholder="Markdownでメモ..."
                    value={note?.markdown ?? ''}
                    onChange={(e) => setNote((n) => n ? { ...n, markdown: e.target.value } : null)} />
          <div className="prose max-w-none p-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{note?.markdown ?? ''}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

function Pomodoro() {
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [running])
  useEffect(() => {
    if (seconds <= 0) setRunning(false)
  }, [seconds])
  return (
    <div className="flex items-center gap-2">
      <span className="tabular-nums font-mono">{Math.floor(seconds/60).toString().padStart(2,'0')}:{(seconds%60).toString().padStart(2,'0')}</span>
      <button className="px-2 py-1 border rounded" onClick={() => setRunning((v)=>!v)}>{running ? '停止' : '開始'}</button>
      <button className="px-2 py-1" onClick={() => setSeconds(25*60)}>リセット</button>
    </div>
  )
}


