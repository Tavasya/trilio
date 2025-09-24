import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useUser } from '@clerk/react-router'
// import { useAppDispatch } from '../store'
// import { fetchOnboardingStatus } from '../features/onboarding/onboardingSlice'

export default function AuthRedirect() {
  const { isSignedIn, isLoaded, user } = useUser()
  // const { getToken } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // const dispatch = useAppDispatch()

  // Handle navigation when user is signed in
  useEffect(() => {
    const handleAuthRedirect = async () => {
      if (!isLoaded || !isSignedIn || !user) return

      // Only handle redirect if we're on the landing page
      if (location.pathname === '/') {
        // Always go to dashboard for now
        navigate('/dashboard')
        // try {
        //   const token = await getToken()
        //   if (token) {
        //     const status = await dispatch(fetchOnboardingStatus(token)).unwrap()

        //     // Navigate immediately based on the API response
        //     if (status.onboarding_completed) {
        //       navigate('/dashboard')
        //     } else {
        //       navigate('/onboarding/1')
        //     }
        //   }
        // } catch (error) {
        //   // Fallback to onboarding if API fails
        //   navigate('/onboarding/1')
        // }
      }
    }

    handleAuthRedirect()
  }, [isLoaded, isSignedIn, user, location.pathname, navigate])

  return null
}
