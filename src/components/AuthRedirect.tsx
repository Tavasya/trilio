import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useUser } from '@clerk/react-router'
import { captureUTMParams, getStoredUTMData } from '../lib/utm'
// import { useAppDispatch } from '../store'
// import { fetchOnboardingStatus } from '../features/onboarding/onboardingSlice'

export default function AuthRedirect() {
  const { isSignedIn, isLoaded, user } = useUser()
  // const { getToken } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // const dispatch = useAppDispatch()

  // Capture UTM params when they exist in URL
  useEffect(() => {
    captureUTMParams()
  }, [location.search])

  // Update user metadata with UTM params if user just signed up
  useEffect(() => {
    const updateUserWithUTM = async () => {
      if (!isLoaded || !isSignedIn || !user) return

      // Check if we already captured UTM for this user
      if (user.unsafeMetadata?.utm_captured) return

      // Get stored UTM data
      const utmData = getStoredUTMData()
      if (!utmData || Object.keys(utmData).length === 0) return

      // Filter out empty values
      const filteredUTMData = Object.entries(utmData).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value
        }
        return acc
      }, {} as Record<string, string>)

      // Only update if we have actual UTM data
      if (Object.keys(filteredUTMData).length > 0) {
        try {
          await user.update({
            unsafeMetadata: {
              ...user.unsafeMetadata,
              ...filteredUTMData,
              utm_captured: true
            }
          })
          // Clear stored UTM data after successful update
          sessionStorage.removeItem('utm_data')
        } catch {
          // Silently fail - UTM tracking is not critical
        }
      }
    }

    updateUserWithUTM()
  }, [isLoaded, isSignedIn, user])

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
