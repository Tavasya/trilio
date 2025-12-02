export interface SubscriptionStatus {
  tier: string;
  status: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  cancel_at?: string;
  trial_start?: string;
  trial_end?: string;
}

export interface CreateCheckoutSessionRequest {
  success_url: string;
  cancel_url: string;
}

export interface CreateCheckoutSessionResponse {
  url: string;
  session_id: string;
}

export interface PendingRequest {
  idea: string;
  hook_id?: number;
  postLength: 'small' | 'medium' | 'large';
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message: string;
  subscription?: SubscriptionStatus;
}
