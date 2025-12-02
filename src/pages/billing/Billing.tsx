import { useAuth } from '@clerk/react-router';
import { useAppSelector } from '../../store/hooks';
import { selectSubscription } from '@/features/subscription/subscriptionSlice';
import { subscriptionService } from '@/features/subscription/subscriptionService';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import type { SubscriptionStatus } from '@/features/subscription/subscriptionTypes';

const Billing = () => {
  const { getToken } = useAuth();
  const { isSubscribed } = useAppSelector(selectSubscription);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionStatus | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // Fetch subscription details on mount and when page regains focus
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const details = await subscriptionService.checkStatus(token);
        setSubscriptionDetails(details);
      } catch (error) {
        console.error('Failed to fetch subscription details:', error);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();

    // Re-fetch when user returns from billing portal (page regains focus)
    const handleFocus = () => {
      fetchDetails();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [getToken]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Authentication required', { position: 'top-right' });
        return;
      }

      const { url } = await subscriptionService.createBillingPortal(
        window.location.href,
        token
      );

      // Redirect to Stripe billing portal
      window.location.href = url;
    } catch (error) {
      console.error('Billing portal error:', error);
      toast.error('Failed to open billing portal', { position: 'top-right' });
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Authentication required', { position: 'top-right' });
        return;
      }

      const response = await subscriptionService.cancelSubscription(token);

      if (response.success) {
        toast.success('Subscription cancelled successfully', { position: 'top-right' });
        // Refresh subscription details
        const details = await subscriptionService.checkStatus(token);
        setSubscriptionDetails(details);
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to cancel subscription', { position: 'top-right' });
    } finally {
      setIsCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  // Check if subscription is cancelled (works for both trial and paid periods)
  const isCancelled = subscriptionDetails?.cancel_at
    ? new Date(subscriptionDetails.cancel_at) > new Date()
    : false;

  const isTrialing = subscriptionDetails?.status === 'trialing';

  // Use cancel_at if cancelled, otherwise use current_period_end
  const nextBillingDate = formatDate(
    isCancelled ? subscriptionDetails?.cancel_at : subscriptionDetails?.current_period_end
  );

  if (loadingDetails) {
    return (
      <div className="h-full overflow-y-auto p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing</h1>
        <p className="text-gray-600 mb-8">Manage your subscription</p>

        {/* Current Plan Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
          <div className="space-y-6">
            {/* Plan Info */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isSubscribed ? 'Trilio Pro' : 'Free Plan'}
                </h2>
                {isSubscribed && (
                  <span className="text-sm text-gray-600">
                    {isCancelled ? 'Cancelled' : isTrialing ? 'Trial' : 'Active'}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {isSubscribed
                  ? 'Unlimited AI-generated LinkedIn posts'
                  : 'Upgrade to unlock unlimited features'}
              </p>
            </div>

            {/* Billing Details */}
            {isSubscribed && (
              <div className="pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-sm font-medium text-gray-900">$19.99/month</span>
                </div>

                {nextBillingDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {isCancelled ? 'Access until' : isTrialing ? 'Trial ends' : 'Next billing'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{nextBillingDate}</span>
                  </div>
                )}

                {isTrialing && !isCancelled && (
                  <p className="text-xs text-gray-500 pt-2">
                    Your card will be charged $19.99 after the trial ends
                  </p>
                )}

                {isCancelled && (
                  <p className="text-xs text-gray-500 pt-2">
                    Your subscription has been cancelled and will end on {nextBillingDate}
                  </p>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="pt-4 space-y-3">
              {isSubscribed ? (
                <>
                  <button
                    onClick={handleManageBilling}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Loading...' : (
                      <>
                        <span>Manage Subscription</span>
                        <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  {!isCancelled && (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="w-full text-red-600 text-sm font-medium py-2 hover:text-red-700 transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full bg-primary text-white font-medium py-2.5 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Manage payment methods, view invoices, and cancel anytime
        </p>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCancelling}
                className="flex-1 bg-gray-100 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="flex-1 bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
