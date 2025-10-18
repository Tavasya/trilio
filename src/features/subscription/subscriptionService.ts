import { API_CONFIG } from '@/shared/config/api';
import type {
  SubscriptionStatus,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from './subscriptionTypes';

class SubscriptionService {
  async checkStatus(token: string): Promise<SubscriptionStatus> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/payments/subscription`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check subscription status');
    }

    return response.json();
  }

  async createCheckoutSession(
    request: CreateCheckoutSessionRequest,
    token: string
  ): Promise<CreateCheckoutSessionResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return response.json();
  }

  async createBillingPortal(returnUrl: string, token: string): Promise<{ url: string }> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/payments/create-billing-portal`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ return_url: returnUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to create billing portal session');
    }

    return response.json();
  }
}

export const subscriptionService = new SubscriptionService();
