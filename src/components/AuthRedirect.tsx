import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useUser } from '@clerk/react-router'

export default function AuthRedirect() {
  const { isSignedIn, isLoaded, user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle navigation when user is signed in
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return
    
    // Only navigate if we're on the landing page
    if (location.pathname === '/') {
      const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user.id}`)
      
      if (hasCompletedOnboarding) {
        navigate('/dashboard')
      } else {
        navigate('/onboarding/1')
      }
    }
  }, [isLoaded, isSignedIn, user, location.pathname, navigate])

  return null
}
