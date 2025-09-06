import { Navigate } from 'react-router';
import { useUser } from '@clerk/react-router';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    // Still loading auth state
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    // Not signed in, redirect to landing
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}