import { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import { useUser, useAuth } from '@clerk/react-router';
import { API_CONFIG } from '@/shared/config/api';

interface DashboardResponse {
  status: string;
  timestamp: string;
  data: Array<{
    user_id: string;
    email: string;
    is_admin: boolean;
  }>;
}

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoaded || !isSignedIn || !user?.id) {
        setIsChecking(false);
        return;
      }

      try {
        const token = await getToken();

        const response = await fetch(`${API_CONFIG.BASE_URL}/api/analytics/dashboard`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          setIsAdmin(false);
          setIsChecking(false);
          return;
        }

        const data: DashboardResponse = await response.json();

        // Find the current user in the response
        const currentUser = data.data.find(u => u.user_id === user.id);

        if (currentUser) {
          setIsAdmin(currentUser.is_admin === true);
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminStatus();
  }, [isLoaded, isSignedIn, user?.id, getToken]);

  if (!isLoaded || isChecking) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (isAdmin === false) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
