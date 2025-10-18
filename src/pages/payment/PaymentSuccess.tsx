import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/react-router';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '../../store/hooks';
import {
  checkSubscriptionStatus,
  clearPendingRequest,
  setSubscribed
} from '@/features/subscription/subscriptionSlice';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handlePostPayment = async () => {
      try {
        const token = await getToken();
        if (!token) {
          toast.error('Authentication required', { position: 'top-right' });
          navigate('/dashboard');
          return;
        }

        // Update subscription status
        await dispatch(checkSubscriptionStatus(token)).unwrap();
        dispatch(setSubscribed(true));

        // Clear the pending request (posts are already generated on dashboard)
        dispatch(clearPendingRequest());

        setIsProcessing(false);

        // Wait a moment to show success, then redirect
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        toast.error('Something went wrong', { position: 'top-right' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    };

    handlePostPayment();
  }, [getToken, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {isProcessing ? (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 animate-pulse">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Activating Your Account
            </h1>
            <p className="text-gray-600">
              Setting up your Trilio Pro subscription...
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Trilio Pro!
            </h1>
            <p className="text-gray-600 mb-4">
              Your 7-day free trial has started. Enjoy unlimited LinkedIn content creation!
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to dashboard...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
