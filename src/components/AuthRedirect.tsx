import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useUser } from '@clerk/react-router'

export default function AuthRedirect() {
  const { isSignedIn, isLoaded } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (isLoaded && isSignedIn && !hasRedirected.current) {
      // Only redirect on initial sign-in, not when navigating back to landing
      if (location.pathname === '/') {
        hasRedirected.current = true
        navigate('/onboarding/1')
      }
    }
  }, [isLoaded, isSignedIn, navigate, location.pathname])

  return null
}
