import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { ClerkProvider } from '@clerk/react-router'
import './index.css'
import { Provider } from 'react-redux'
import store from './store.ts'
import AppRoutes from './router.tsx'
import AuthRedirect from './components/AuthRedirect'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Provider store={store}>
          <AuthRedirect />
          <Routes>
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
          <Toaster position="top-right" />
        </Provider>
      </ClerkProvider>
    </BrowserRouter>
    <Analytics />
  </StrictMode>,
)
