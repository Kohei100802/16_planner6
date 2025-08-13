import Dexie, { Table } from 'dexie'

export type DayNote = {
  id: string // yyyy-MM-dd
  markdown: string
  userId: string
  updatedAt: number
}

export type Goal = { id: string; title: string; order: number; userId: string; date: string }
export type Reminder = { id: string; title: string; order: number; userId: string; date: string; due?: string }
export type CalendarEvent = {
  id: string
  userId: string
  calendarId: string
  title: string
  start: string
  end?: string
  allDay?: boolean
}

export class PlannerDB extends Dexie {
  dayNotes!: Table<DayNote, string>
  goals!: Table<Goal, string>
  reminders!: Table<Reminder, string>
  events!: Table<CalendarEvent, string>

  constructor() {
    super('planner-db')
    this.version(1).stores({
      dayNotes: 'id, userId, updatedAt',
      goals: 'id, userId, date, order',
      reminders: 'id, userId, date, order',
      events: 'id, userId, start',
    })
  }
}

export const db = new PlannerDB()


