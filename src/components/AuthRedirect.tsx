import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useUser } from '@clerk/react-router'

export default function AuthRedirect() {
  const { isSignedIn, isLoaded, user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoaded) return

    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user?.id}`)
    
    if (isSignedIn && location.pathname === '/') {
      if (hasCompletedOnboarding) {
        // User has completed onboarding, go to dashboard
        navigate('/dashboard')
      } else {
        // New user, go to onboarding
        navigate('/onboarding/1')
      }
    }
  }, [isLoaded, isSignedIn, user?.id, navigate, location.pathname])

  return null
}
