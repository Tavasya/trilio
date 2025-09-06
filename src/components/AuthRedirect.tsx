import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useUser } from '@clerk/react-router'

export default function AuthRedirect() {
  const { isSignedIn, isLoaded, user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (!isLoaded) return

    // Only redirect on initial sign-in, not when navigating back to landing
    // This allows signed-in users to visit the landing page
    if (isSignedIn && location.pathname === '/' && !hasRedirected.current) {
      // Check if this is a fresh sign-in (coming from Clerk's sign-in flow)
      const isFromSignIn = document.referrer.includes('clerk.accounts') || 
                          sessionStorage.getItem('just_signed_in') === 'true'
      
      if (isFromSignIn) {
        hasRedirected.current = true
        sessionStorage.removeItem('just_signed_in')
        
        // Check if user has completed onboarding
        const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user?.id}`)
        
        if (hasCompletedOnboarding) {
          navigate('/dashboard')
        } else {
          navigate('/onboarding/1')
        }
      }
    }
  }, [isLoaded, isSignedIn, user?.id, navigate, location.pathname])

  // Set flag when signing in
  useEffect(() => {
    if (isSignedIn && !sessionStorage.getItem('signed_in_flag')) {
      sessionStorage.setItem('just_signed_in', 'true')
      sessionStorage.setItem('signed_in_flag', 'true')
    } else if (!isSignedIn) {
      sessionStorage.removeItem('signed_in_flag')
      sessionStorage.removeItem('just_signed_in')
    }
  }, [isSignedIn])

  return null
}
