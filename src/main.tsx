import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './shell/AppShell'
import { AuthGate } from './shell/AuthGate'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGate>
        <AppShell />
      </AuthGate>
    ),
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
