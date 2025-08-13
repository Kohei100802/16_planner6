import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'

type UIState = {
  selectedDate: string // yyyy-MM-dd
  setSelectedDate: (iso: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      selectedDate: format(new Date(), 'yyyy-MM-dd'),
      setSelectedDate: (iso) => set({ selectedDate: iso }),
    }),
    { name: 'ui-store' },
  ),
)


