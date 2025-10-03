import { Navigate } from 'react-router';
import { useUser } from '@clerk/react-router';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();

  console.log('[ProtectedRoute] isLoaded:', isLoaded, 'isSignedIn:', isSignedIn)

  if (!isLoaded) {
    // Still loading auth state
    console.log('[ProtectedRoute] Showing loading state')
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    // Not signed in, redirect to landing
    console.log('[ProtectedRoute] User not signed in, redirecting to landing')
    return <Navigate to="/" replace />;
  }

  console.log('[ProtectedRoute] User authenticated, rendering protected content')
  return <>{children}</>;
}