import { X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';
import { subscriptionService } from '@/features/subscription/subscriptionService';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaywallModal = ({ isOpen, onClose }: PaywallModalProps) => {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Authentication required', { position: 'top-right' });
        return;
      }

      const { url } = await subscriptionService.createCheckoutSession(
        {
          success_url: `${window.location.origin}/payment-success`,
          cancel_url: `${window.location.origin}/dashboard`,
        },
        token
      );

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to start checkout', { position: 'top-right' });
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      {/* Modal - only this is clickable */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300 pointer-events-auto border-2 border-primary">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-full mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Unlock Your Posts
          </h2>
          <p className="text-sm text-gray-600">
            Start creating unlimited LinkedIn content
          </p>
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 rounded-lg p-4 mb-5">
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <span className="text-3xl font-bold text-gray-900">$19.99</span>
            <span className="text-gray-600 text-sm">/month</span>
          </div>
          <p className="text-center text-xs text-gray-600">
            7-day free trial • Cancel anytime
          </p>
        </div>

        {/* Features - Compact */}
        <ul className="space-y-2 mb-5 text-sm">
          <li className="flex items-center gap-2 text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
            <span>Unlimited AI-generated posts</span>
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
            <span>Schedule & automate publishing</span>
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
            <span>Multiple content variations</span>
          </li>
        </ul>

        {/* CTA Button */}
        <button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Start Free Trial'}
        </button>

        <p className="text-center text-xs text-gray-500 mt-3">
          No credit card required
        </p>
      </div>
    </div>
  );
};

export default PaywallModal;
