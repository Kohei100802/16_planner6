import { create } from 'zustand'

export type AuthUser = { uid: string; displayName?: string | null }

type AuthState = {
  user: AuthUser | null
  setUser: (u: AuthUser | null) => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
}))


