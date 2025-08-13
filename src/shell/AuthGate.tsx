import { ReactNode, useEffect, useState } from 'react'
import { onAuthStateChanged, getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { initFirebase } from '../shared/firebase'
import { useAuth } from '../shared/auth'

type Props = {
  children: ReactNode
}

export function AuthGate({ children }: Props) {
  const [ready, setReady] = useState(false)
  const { user, setUser } = useAuth()

  useEffect(() => {
    initFirebase()
    const auth = getAuth()
    return onAuthStateChanged(auth, (u) => {
      setUser(u ? { uid: u.uid, displayName: u.displayName } : null)
      setReady(true)
    })
  }, [])

  if (!ready) {
    return <div className="h-full flex items-center justify-center">読み込み中…</div>
  }

  if (!user) {
    const auth = getAuth()
    const login = async () => {
      try {
        await signInWithPopup(auth, new GoogleAuthProvider())
      } catch (e) {
        console.error(e)
      }
    }
    return (
      <div className="h-full grid place-items-center bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow border w-80 text-center space-y-4">
          <h1 className="text-xl font-semibold">Planner へログイン</h1>
          <button className="w-full rounded-md bg-brand-600 text-white py-2" onClick={login}>Googleでログイン</button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}


